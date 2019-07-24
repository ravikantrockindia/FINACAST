({
    doInit : function(component, event, helper) { 
        
        component.set("v.SearchText", null );
        var columns = [];
        var nameSpace = component.get("v.packageName");        
        var action = component.get("c.ColumnSet");        
        action.setCallback(this,function(response) {
            var state =response.getState();
            if (state === "SUCCESS") {
                var allFieldList = response.getReturnValue().lstFields;
                
                var allColumnList = [];
                var counter = 0;
                var referenceFieldsArray = [];              
                //create column labels meta databu
                for(var i in allFieldList){
                    
                    if (allFieldList[i].fieldName.indexOf('.') != -1){
                        referenceFieldsArray.push(allFieldList[i].fieldName);
                    }                    
                    
                    if(allFieldList[i].type == 'DATE'){
                        allColumnList.push({ 
                            "label" :  allFieldList[i].label.toUpperCase(),
                            "fieldName" : allFieldList[i].fieldName,
                            "sortable" : 'true',
                            "type" :  'date-local',
                            typeAttributes:{
                                month: "2-digit",
                                day: "2-digit"} ,
                        });
                    } 
                    
                    else if(allFieldList[i].type == 'DATETIME'){
                        allColumnList.push({ 
                            "label" :  allFieldList[i].label.toUpperCase(),
                            "fieldName" : allFieldList[i].fieldName,
                            "sortable" : 'true',
                            "type" :  'date',
                            typeAttributes:{
                                year: "numeric",
                                month: "long",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit"} ,
                        });
                    }
                    
                        else if(allFieldList[i].fieldName == 'Name'){
                            allColumnList.push({
                                "label" :  'Client Name',
                                "fieldName" : 'linkName',
                                "sortable" : 'true',
                                "type" :  'url',
                                "typeAttributes" :  {
                                    label: { fieldName: 'Name' },
                                    target: '_blank'}
                            });
                        }
                    
                            else{
                                allColumnList.push({
                                    "label" :  allFieldList[i].label.toUpperCase(),
                                    "fieldName" : allFieldList[i].fieldName,
                                    "sortable" : 'true',
                                    "type" :  'text'
                                });
                            } 
                }
                component.set("v.mycolumns", allColumnList);
                
                var ListWrapper = response.getReturnValue();    
                var data = ListWrapper.lstSObject;             
                var updatedColumns = ListWrapper.columnsSaving;
                var showColumns = [];
                
                if(!$A.util.isUndefinedOrNull(updatedColumns)){
                    showColumns = updatedColumns.split(',');
                    component.set("v.selectedValues",showColumns);
                }
                else{
                    showColumns = [];
                }
                
                helper.setDisplayColumns(component, event, helper,showColumns);
                //var setColumns = [];
                
                data.forEach(function(record){
                    record.linkName = '/'+record.Id;
                    console.log("test"+ record.linkName);
                });
                
                component.set("v.totalPages", Math.round(data.length/component.get("v.pageSize")));            
                component.set("v.allData", data ); 
                component.set("v.currentPageNumber",1);
                helper.buildData(component, helper);
            }
        });
        
        $A.enqueueAction(action);
    },
    
    onNext : function(component, event, helper) {        
        var pageNumber = component.get("v.currentPageNumber");
        component.set("v.currentPageNumber", pageNumber+1);
        helper.buildData(component, helper);
    },
    
    onPrev : function(component, event, helper) {        
        var pageNumber = component.get("v.currentPageNumber");
        component.set("v.currentPageNumber", pageNumber-1);
        helper.buildData(component, helper);
    },
    
    processMe : function(component, event, helper) {
        component.set("v.currentPageNumber", parseInt(event.target.name));
        helper.buildData(component, helper);
    },
    
    onFirst : function(component, event, helper) {        
        component.set("v.currentPageNumber", 1);
        helper.buildData(component, helper);
    },
    
    onLast : function(component, event, helper) {        
        component.set("v.currentPageNumber", component.get("v.totalPages"));
        helper.buildData(component, helper);
    },
    
    handleSort : function(component,event,helper){
        //Returns the field which has to be sorted
        var sortBy = event.getParam("fieldName");
        console.log('sortBy'+sortBy);
        component.set("v.sortBy",sortBy);
        var sortDirection = event.getParam("sortDirection");
        component.set("v.sortDirection",sortDirection);
        
        helper.sortData(component,helper,sortBy,sortDirection);
    },
    SearchClient : function(component, event, helper){
        component.find("Id_spinner").set("v.class" , 'slds-show');
        var Search=component.get("v.SearchText");
        console.log('Search'+Search);
        var action=component.get("c.getLimitedAccounts");
        action.setParams({"searchKeyword" : Search});
        action.setCallback(this, function(response){
            var state =response.getState();
            if (state === "SUCCESS") {
                component.find("Id_spinner").set("v.class" , 'slds-hide');
                var data = response.getReturnValue();
                data.forEach(function(record){
                    record.linkName = '/'+record.Id;
                    console.log("test"+ record.linkName);
                });
                component.set("v.allData", data); 
                
                component.set("v.totalPages", Math.floor(data.length/component.get("v.pageSize")));            
                component.set("v.currentPageNumber",1);
                helper.buildData(component, helper);
            }
        });
        $A.enqueueAction(action);
    },
    
    //onclick functionality for button "Add New"
    addclient: function(component,event,helper){
        /* var evt = $A.get("e.force:navigateToURL");
        evt.setParams({
            "url"  : "/lightning/n/create_client",
            
        });       
        evt.fire(); */
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            pageReference: {
                "type": "standard__component",
                "attributes": {
                    "componentName": "c__CreateNewClient"
                },
                "state": {}
            },
            focus: true
        }).then(function(response) {
            workspaceAPI.getTabInfo({
                tabId: response
            }).then(function(tabInfo) {
                console.log("The recordId for this tab is: " + tabInfo.recordId);
            });
        }).catch(function(error) {
            console.log(error);
        });
    },
    
    addColumns : function(component , event , helper){
        component.set("v.col",true);
    },
    
    handleFilterEvent: function(component, event, helper){
        helper.obtainFilter(component, event , helper );
    },
    
    addFilter: function(component, event, helper){
        var showfilter = component.find('filterList');
        var table = component.find('dataTable');
        
        if(component.get("v.flag")){      
            component.set("v.flag", false);
            $A.util.addClass(table, 'slds-size_2-of-3');            
            $A.util.removeClass(showfilter, 'slds-hide');
            $A.util.addClass(showfilter, 'slds-size_1-of-3');
        }       
        else{
            component.set("v.flag", true);
            $A.util.removeClass(table, 'slds-size_2-of-3');
            $A.util.addClass(showfilter, 'slds-hide');
            $A.util.addClass(table, 'slds-col');
        }
    },
    handleComponentEvent: function(cmp,event){
        var vals = event.getParam("lid");
        var vals1 = event.getParam("listName");
        var vals2 = event.getParam("listObjectName");
        var vals3 = event.getParam("listType");
        var vals4 = event.getParam("listStatus");      
        cmp.set('v.addRecords',true);
        var temp = cmp.find("div1"); 
        $A.util.addClass(temp, 'slds-hide');
        cmp.set("v.lid", vals);        
        cmp.set("v.listName",vals1 );        
        cmp.set("v.listObjectName",vals2 );
        cmp.set("v.listType", vals3);
        cmp.set("v.listStatus", vals4);       
        cmp.set("v.isValueSet", true);
        cmp.set("v.filterEditMode", true);
        
    },
    
})