({
	getObjectFields : function(component, event, helper) {
        //REMOVE THIS
        component.set("v.editMode",true);
        
        var sObjectName = component.get("v.sObjectName");
        console.log('sObjectName'+sObjectName);
        if($A.util.isEmpty(sObjectName)){
        	helper.showToast("Error!", "Object not provided!");
            helper.hideFilterPopup();
            return;
        }
        helper.setOperatorsList(component, helper);
        //helper.setOwnerFilters(component, helper, sObjectName);
        helper.callApexForObjectFields(component, event, helper, sObjectName);
	},
    
    addAnotherFilter : function(component, event, helper){
        //helper.enlistPreviousFilter(component, event, helper);
        helper.addNewFilter(component, event, helper);
    },
    
    removeAllFilters : function(component, event, helper){
        //helper.addFreshFilter(component, event, helper);
        var filterList = component.get("v.filters");
        if(!$A.util.isEmpty(filterList)){
            helper.setFiltersUpdatedTrue(component, event, helper);
        }
        component.set("v.filters",[]);
    },
    
    handleFieldChange : function(component, event, helper){
        //Update the datatype of the current field
        var filterIndex = event.getSource().get("v.name").split("_")[0];
        var selectedField = event.getSource().get("v.value");
        var filterList = component.get("v.filters");
        var fieldList = component.get("v.objectFields");
        for(var i in filterList){
            if(filterList[i].index == filterIndex){
                for(var j in fieldList){
                    if(fieldList[j].apiName == selectedField){
                        filterList[i].dataType = fieldList[j].dType;
                        filterList[i].operator = component.get("v.operators")[0].key;
                        filterList[i].value = filterList[i].dataType == "BOOLEAN" ? "false" : "";
                        filterList[i].valueList = [];
                        if(fieldList[j].dType == "PICKLIST"){
                            filterList[i].valueList = JSON.parse(JSON.stringify(fieldList[j].pkValList));
                        }
                        break;
                    }
                }
                break;
            }
        }
        component.set("v.filters", filterList);
        helper.setFiltersUpdatedTrue(component, event, helper);
    },
    
    handleOperatorChange : function(component, event, helper){
        helper.setFiltersUpdatedTrue(component, event, helper);
    },
    
    handleValueChange : function(component, event, helper){
        helper.setFiltersUpdatedTrue(component, event, helper);
    },
    
    handleFilterRowDelete : function(component, event, helper){
        var filterIndex = event.getSource().get("v.name").split("_")[0];
        var filterList = component.get("v.filters");
        if(filterList.length > 1){
            var deleteIndex = 0;
            for(var i in filterList){
                if(filterList[i].index == filterIndex){
                    deleteIndex = i;
                    break;
                }
            }
            filterList.splice(deleteIndex,1);
            //reorder indexes
            for(var i in filterList){
                filterList[i].index = Number(i)+Number(1);
            }
        }
        else{
            filterList=[];
            //helper.addFreshFilter(component, event, helper);
        }
        component.set("v.filters", filterList);
        helper.setFiltersUpdatedTrue(component, event, helper);
    },
    
    updateFilter : function(component, event, helper){
        var filterIndex = event.getSource().get("v.name").split("_")[0];
        var filters = component.get("v.filters");
        
        //Remove unwanted spaces from values
        if(!filters[filterIndex-1].dataType == "PICKLIST"){
            filters[filterIndex-1].value = filters[filterIndex-1].value.replace(/\s+/g,' ').trim();
        }
        
        if($A.util.isEmpty(filters[filterIndex-1].value) || $A.util.isUndefinedOrNull(filters[filterIndex-1].value)){
            
        }else{
            if(filters[filterIndex-1].dataType == "DATE" || filters[filterIndex-1].dataType == "DATETIME"){
                filters[filterIndex-1].value = filters[filterIndex-1].value.toUpperCase();
                var dateValue=filters[filterIndex-1].value;
                if(filters[filterIndex-1].dataType == "DATE" && dateValue.split(" ").length>1){
                    var checkIfRelativeDateFunction = helper.checkIfDateFunction(component, helper, dateValue);
                    if(!checkIfRelativeDateFunction){
                        alert("Invalid Date");
                        return;
                    }
                }
                var result = helper.validateDateInput(component, helper, dateValue);
                if(!result){
                    var checkIfRelativeDateFunction = helper.checkIfDateFunction(component, helper, dateValue);
                    if(!checkIfRelativeDateFunction){
                        alert("Invalid Date");
                        return;
                    }
                }
                if(filters[filterIndex-1].dataType == "DATETIME" && !filters[filterIndex-1].value.includes(":") 
                   && filters[filterIndex-1].value.includes("/")  && component.get("v.timeZoneOffset")==0){
                    var action = component.get("c.getUserTimeZoneOffsetApex");
                    action.setParams({
                        "value" : filters[filterIndex-1].value
                    });
                    action.setCallback(this,function(response){
                        if(response.getState() === "SUCCESS"){
                            component.set("v.timeZoneOffset",response.getReturnValue());
                         //   console.log("Offset: "+response.getReturnValue());
                        }
                        else{
                          //  console.log("Unable to fetch timezone offset");
                        }
                    });
                    $A.enqueueAction(action);
                }
            }
        }
        filters[filterIndex-1].editMode = false;
        component.set("v.filters",filters);
       // console.log("Filter: "+ JSON.stringify(filters));
    },
    
    updateOwnerFilter : function(component, event, helper){
        component.set("v.ownerFilterEdit",false);
    },
    
    cancelFilters : function(component, event, helper){
        //Overwrite the "filters" attribute value with "filtersBackup" 
        /*var width = Number(component.find("measurement").getElement().getBoundingClientRect().width) + 5;
        component.set("v.screenWidth",width+"px");
        console.log(width);*/
        var backupFilters = JSON.parse(JSON.stringify(component.get("v.filtersBackup")));
        if(backupFilters.length>0){
            if(backupFilters[0].index == 0 && backupFilters[0].field == "SCOPE"){
                component.set("v.ownerFilterValue", "MY");
                backupFilters.splice(0,1);
            }
            else{
                component.set("v.ownerFilterValue", "ALL");
            }
        }
        else{
            component.set("v.ownerFilterValue", "ALL");
        }
        component.set("v.filters",JSON.parse(JSON.stringify(backupFilters)));
        
        var customLogic = component.get("v.customFilterLogicBackup");
        if($A.util.isEmpty(customLogic)){
            component.set("v.customFilterLogicProvided", false);
            component.set("v.customFilterLogic", "");
        }
        else{
            component.set("v.customFilterLogicProvided", true);
            component.set("v.customFilterLogic", JSON.parse(JSON.stringify(customLogic)));
        }
        component.set("v.customFilterLogicDisplayMessage", "");
        component.set("v.filters",JSON.parse(JSON.stringify(backupFilters)));
        helper.setFiltersUpdatedFalse(component, event, helper);
    },
    
    hideFilters : function(component, event, helper){
        var appEvent = $A.get("e.c:Fina_HideFilterEvent"); 
        appEvent.setParams({"isfilterVisible" : false}); 
        appEvent.fire(); 
       
    },
    
    applyFilters : function(component, event, helper){
        var transformedFilterLogic = "";
        var customFilterLogic = '';
        if(component.get("v.customFilterLogicProvided") && !$A.util.isEmpty(component.get("v.customFilterLogic"))){
            customFilterLogic = component.get("v.customFilterLogic");
            var result = helper.validateCustomFilterLogic(component, helper, customFilterLogic);
            if(result){
                component.set("v.customFilterLogicDisplayMessage","");
                transformedFilterLogic = helper.transformFilterLogic(component,helper, customFilterLogic);
            }
            else{
                return;
            }
        }
        else{
            component.set("v.customFilterLogicProvided", false);
            component.set("v.customFilterLogic", "");
        }
        helper.upsertFiltersAndCreateWhereClause(component, event, helper, customFilterLogic, transformedFilterLogic);
         helper.hideFilters1(component, event, helper);
    },
    
    /*saveFilters : function(component, event, helper){
        var customFilterLogic = '';
        if(component.get("v.customFilterLogicProvided") && !$A.util.isEmpty(component.get("v.customFilterLogic"))){
            customFilterLogic = component.get("v.customFilterLogic");
        }
        else{
            component.set("v.customFilterLogicProvided", false);
            component.set("v.customFilterLogic", "");
        }
        helper.upsertFilters(component, event, helper, customFilterLogic);
    },*/
    
    handleTrueClick : function(component, event, helper){
        var filterIndex = event.getSource().get("v.name").split("_")[0];
        var filterList = component.get("v.filters");
        for(var i in filterList){
            if(filterList[i].index == filterIndex){
                filterList[i].value = 'true';
                break;
            }
        }
        component.set("v.filters", filterList);
        helper.setFiltersUpdatedTrue(component, event, helper);
    },
    
    handleFalseClick : function(component, event, helper){
        var filterIndex = event.getSource().get("v.name").split("_")[0];
        var filterList = component.get("v.filters");
        for(var i in filterList){
            if(filterList[i].index == filterIndex){
                filterList[i].value = 'false';
                break;
            }
        }
        component.set("v.filters", filterList);
        helper.setFiltersUpdatedTrue(component, event, helper);
    },
    
    handleMultiselectChange : function(component, event, helper){
        helper.setFiltersUpdatedTrue(component, event, helper);
        /*var selectedOptionsList = event.getParam("value");
        alert("Options selected: '" + selectedOptionsList + "'");*/
    },
    
    handleOwnerFilterChange : function(component, event, helper){
        helper.setFiltersUpdatedTrue(component, event, helper);
    },
    
    addFilterLogic : function(component, event, helper){
        component.set("v.customFilterLogicProvided", true);
        helper.setFiltersUpdatedTrue(component, event, helper);
    },
    
    removeFilterLogic : function(component, event, helper){
        component.set("v.customFilterLogicProvided", false);
        component.set("v.customFilterLogic", "");
        component.set("v.customFilterLogicDisplayMessage", "");
        helper.setFiltersUpdatedTrue(component, event, helper);
    },
    
    makeFilterEditable : function(component, event, helper){
        if(component.get("v.editMode") == true){
            var filterIndex = event.currentTarget.id;
            if(filterIndex == "ownerFilter"){
                component.set("v.ownerFilterEdit",true);
                var width = Number(event.currentTarget.getBoundingClientRect().width) + 20;
                component.set("v.screenWidth",width+"px");
            }else{
                filterIndex = event.currentTarget.id.split("_")[0];
                var filters = component.get("v.filters");
                filters[filterIndex-1].editMode = true;
                component.set("v.filters",filters);
                var width = Number(event.currentTarget.getBoundingClientRect().width) + 20;
                component.set("v.screenWidth",width+"px");
                for(var index in filters){
                    if(filters[index].index != filterIndex){
                        filters[index].editMode = false;
                    }
                }
            }
        }
    },
    
    handleFilterLogicEdit : function(component, event, helper){
        helper.setFiltersUpdatedTrue(component, event, helper);
    }
})