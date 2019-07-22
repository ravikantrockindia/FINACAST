({
    callApexForObjectFields : function(component, event, helper, sObjectName){
        
        var objectFieldsAction = component.get("c.getObjectFieldsApex");
        objectFieldsAction.setParams({
            "objectName" : sObjectName
        });
        objectFieldsAction.setCallback(this, function(response) {
            if(response.getState() === "SUCCESS"){
                var objFlds = response.getReturnValue();
                //console.log('Namespace in filter should be: ' +  objFlds.namespace);
                component.set("v.pkageName" ,objFlds.namespace);
                var a = component.get("v.pkageName");
                //console.log('Namespace in filter is: ' + a);
                component.set("v.objectFields",objFlds.fieldData);
              //  helper.fetchExistingListFilters(component, event, helper, objFlds);
                //console.log(JSON.stringify(component.get("v.objectFields")));
                //helper.addFreshFilter(component, event, helper);
            }
            else{
                helper.showToast("Error!", "Unable to fetch object fields!");
                helper.hideFilterPopup();
                return;
            }
        });
        $A.enqueueAction(objectFieldsAction);
    },
    
   /* fetchExistingListFilters : function(component, event, helper, objFlds){
         var nameSpace = component.get("v.pkageName");
        if(component.get("v.sObjectName") != nameSpace + "Dialpad_List__c"){
            var objectFields = component.get("v.objectFields");
            var fetchFiltersAction = component.get("c.fetchExistingFiltersApex");
            fetchFiltersAction.setParams({
                "listId" : component.get("v.listId")
            });
            fetchFiltersAction.setCallback(this, function(response){
                if(response.getState() === "SUCCESS"){
                    var filtersMap = response.getReturnValue();
                    var filters=[];
                    for(var key in filtersMap){
                        filters = filtersMap[key];
                        if(key != "NA"){
                            component.set("v.customFilterLogicProvided", true);
                            component.set("v.customFilterLogic", key);
                            component.set("v.customFilterLogicBackup", key);
                            component.set("v.customFilterLogicDisplayMessage", "");
                        }
                    }
                    if(filters.length>0){
                        if(filters[0].index == 0 && filters[0].field == "SCOPE"){
                            component.set("v.ownerFilterValue", "MY");
                            filters.splice(0,1);
                        }
                        for(var index in filters){
                            if(filters[index].dataType == "PICKLIST"){
                                filters[index].value = filters[index].value.split(",");
                                for(var i in objectFields){
                                    if(objectFields[i].apiName == filters[index].field){
                                        filters[index]["valueList"] = JSON.parse(JSON.stringify(objectFields[i].pkValList));
                                    }
                                }
                            }
                            filters[index].index = Number(filters[index].index);
                            filters[index].editMode = false;
                        }
                    }
                    else{
                        //console.log("No Filters Present for this list");
                        filters=[];
                    }
                    component.set("v.filters",filters);
                    component.set("v.filtersBackup",JSON.parse(JSON.stringify(filters)));
                }
                else{
                    //console.log("Unable to fetch Filters");
                    helper.showToast("Error!", "Unable to fetch list filters!");
                    helper.hideFilterPopup();
                    return;
                }
            });
            $A.enqueueAction(fetchFiltersAction);
        }
    },*/
    
    setOwnerFilters : function(component, helper, sObjectName){
        var objectLabel = "Records";
        if(sObjectName == "Lead"){
            objectLabel = "leads";
        }
        if(sObjectName == "Account"){
            objectLabel = "accounts";
        }
        if(sObjectName == "Opportunity"){
            objectLabel = "opportunities";
        }
        if(sObjectName == "Contact"){
            objectLabel = "contacts";
        }
        var ownerFilters =  [
            {"label": "All " + objectLabel, "value": "ALL"},
            {"label": "My " + objectLabel, "value": "MY"}
        ];
        component.set("v.ownerFilter",ownerFilters);
        //component.set("v.ownerFilterValue", "ALL");
    },
    
    hideFilterPopup : function(component, event, helper){
        
        return;
    },
    
    setOperatorsList : function(component, helper){
        var operatorsList = [];
        //type_1 : STRING, PICKLIST, TEXTAREA, EMAIL, URL, PHONE
        //type_2 : BOOLEAN
        //type_3 : DOUBLE, INTEGER, DATE, DATETIME, NUMBER, CURRENCY 
        operatorsList.push({value: "equals", key: "=", type_1: true, type_2: true, type_3: true});
        operatorsList.push({value: "not equals to", key:"!=", type_1: true, type_2: true, type_3: true});
        operatorsList.push({value: "less than", key: "<", type_1: true, type_2: false, type_3: true});
        operatorsList.push({value: "greater than", key: ">", type_1: true, type_2: false, type_3: true});
        operatorsList.push({value: "Less or equal", key: "<=", type_1: true, type_2: false, type_3: true});
        operatorsList.push({value: "greater or equal", key: ">=", type_1: true, type_2: false, type_3: true});
        operatorsList.push({value: "contains", key: "LIKE", type_1: true, type_2: false, type_3: false});
        operatorsList.push({value: "does not contain", key: "NOT LIKE", type_1: true, type_2: false, type_3: false});
        operatorsList.push({value: "starts with", key: "START LIKE", type_1: true, type_2: false, type_3: false});
        component.set("v.operators", operatorsList);
    },
    
    enlistPreviousFilter : function(component, event, helper){
        
    },
    
    getOperatorObject : function(component, helper, operator){
        var operatorsList = component.get("v.operators");
        for(var index in operatorsList){
            if(operatorsList[index].value === operator){
                return operatorsList[index].key;
            }
        }
    },
    
    addNewFilter : function(component, event, helper){
        var filters = component.get("v.filters");
        var newFilter = {};
        if($A.util.isEmpty(filters)){
            helper.addFreshFilter(component, event, helper);
        }
        else{
            var value="";
            var valueList=[];
            var firstField = component.get("v.objectFields")[0];
            if(firstField.dType == "BOOLEAN"){
                value="false";
            }
            if(firstField.dType == "PICKLIST"){
               valueList = JSON.parse(JSON.stringify(firstField.pkValList));
            }
            newFilter = {"id" : "1",
                         "index" : filters.length+1,
                         "field" : JSON.parse(JSON.stringify(firstField.apiName)),
                         "operator" : JSON.parse(JSON.stringify(component.get("v.operators")[0].key)),
                         "value" : value,
                         "dataType" : component.get("v.objectFields")[0].dType,
                         "valueList" : valueList,
                         "editMode" : false
                        }
            filters.push(newFilter);
            component.set("v.filters",filters);
        }
        helper.setFiltersUpdatedTrue(component, event, helper);
    },
    
    addFreshFilter : function(component, event, helper){
        var value="";
        var valueList=[];
        var firstField = component.get("v.objectFields")[0];
        if(firstField.dType == "BOOLEAN"){
            value="false";
        }
        if(firstField.dType == "PICKLIST"){
            valueList = JSON.parse(JSON.stringify(firstField.pkValList));
        }
        component.set("v.filters",[{"id" : "1",
                                    "index" : 1,
                                    "field" : JSON.parse(JSON.stringify(firstField.apiName)),
                                    "operator" : JSON.parse(JSON.stringify(component.get("v.operators")[0].key)),
                                    "value" : value,
                                    "dataType" : component.get("v.objectFields")[0].dType,
                                    "valueList" : valueList,
                                    "editMode" : false
                                   }]);
    },
    
    setFiltersUpdatedTrue : function(component, event, helper){
        component.set("v.filtersUpdated",true);
    },
    
    hideFilters1 : function(component, event, helper){
        var appEvent = $A.get("e.c:Fina_HideFilterEvent"); 
        appEvent.setParams({"isfilterVisible" : false}); 
        appEvent.fire(); 
       
    },
    
    setFiltersUpdatedFalse : function(component, event, helper){
        component.set("v.filtersUpdated",false);
    },
    
    upsertFiltersAndCreateWhereClause : function(component, event, helper, customFilterLogic, transformedFilterLogic){
        //console.log("Savig Filters for List Id: "+component.get("v.listId"));
        //For Testing:-
        helper.createWhereClauseAndFireEvent(component, event, helper, transformedFilterLogic);
        //console.log(component.get("v.whereClause"));
        helper.setFiltersUpdatedFalse(component, event, helper);
    },
 
    /*upsertFilters : function(component, event, helper, customFilterLogic){
         var nameSpace = component.get("v.pkageName");
        if(component.get("v.sObjectName") != nameSpace +  "Dialpad_List__c"){
            var filtersToSave = JSON.parse(JSON.stringify(component.get("v.filters")));
            for(var index in filtersToSave){
                if(filtersToSave[index].dataType == "PICKLIST"){
                    filtersToSave[index].value = filtersToSave[index].value.join();
                }
            }
            var upsertFiltersAction = component.get("c.upsertFiltersApex");
            upsertFiltersAction.setParams({
                "filters" : JSON.stringify(filtersToSave),
                "customFilterLogic" : customFilterLogic,
                "whereClause" : component.get("v.whereClause"),
                "listId" : component.get("v.listId"),
                "scope" : component.get("v.ownerFilterValue") == "MY" ? "mine" : ""
            });
            upsertFiltersAction.setCallback(this, function(response){
                if(response.getState() === "SUCCESS"){
                    //console.log("I am in success!");
                    //helper.createWhereClauseAndFireEvent(component, event, helper, transformedFilterLogic);
                    helper.setFiltersUpdatedFalse(component, event, helper);
                }
                else{
                    //console.log("I am in error!");
                    helper.showToast("Error!", "Unable to save list filters!");
                }
            });
            $A.enqueueAction(upsertFiltersAction);
        }
    },*/

    createWhereClauseAndFireEvent : function(component, event, helper, transformedFilterLogic){
        //Create where clause from the filters
        var customFilterProvided = false;
        var whereClause = "";
        if(!$A.util.isEmpty(transformedFilterLogic)){
            customFilterProvided = true;
            whereClause = transformedFilterLogic;
        }
        var filterList = component.get("v.filters");
        for(var i in filterList){
            var clause = "";
            
            //Check if the value is NULL or EMPTY then the operator should either me equals or not equals
            if($A.util.isEmpty(filterList[i].value) && !(filterList[i].operator == '=' || filterList[i].operator == '!=')){
                continue;
            }
                
            if(i != 0 && !customFilterProvided){
                clause += " AND ";
            }
            
            if(filterList[i].dataType == "STRING" || filterList[i].dataType == "TEXTAREA" || filterList[i].dataType == "EMAIL" 
               || filterList[i].dataType == "URL" || filterList[i].dataType == "PHONE" || filterList[i].dataType == "PICKLIST"){
                if(filterList[i].dataType == "PICKLIST"){
                    clause+="(";
                    var values = [];
                    values = filterList[i].value;
                    for(var k in values){
                        if(k!=0){
                            clause += " OR ";
                        }
                        switch(filterList[i].operator){
                            case "LIKE" : clause += filterList[i].field;
                                clause += " LIKE \'%";
                                clause += values[k] + "%\'";
                                break;
                            case "NOT LIKE" : clause += " (NOT " + filterList[i].field;
                                clause += " LIKE \'%";
                                clause += values[k] + "%\')";
                                break;
                            case "START LIKE" : clause += filterList[i].field;
                                clause += " LIKE \'";
                                clause += values[k] + "%\'";
                                break;
                            default : clause += filterList[i].field;
                                clause += " " + filterList[i].operator + " ";
                                clause += "\'" + values[k] + "\'";
                                break;
                        };
                    }
                    clause += ")";
                }
                else{
                    switch(filterList[i].operator){
                        case "LIKE" : clause += filterList[i].field;
                            clause += " LIKE \'%";
                            clause += filterList[i].value + "%\'";
                            break;
                        case "NOT LIKE" : clause += " (NOT " + filterList[i].field;
                            clause += " LIKE \'%";
                            clause += filterList[i].value + "%\')";
                            break;
                        case "START LIKE" : clause += filterList[i].field;
                            clause += " LIKE \'";
                            clause += filterList[i].value + "%\'";
                            break;
                        default : clause += filterList[i].field;
                            clause += " " + filterList[i].operator + " ";
                            if($A.util.isEmpty(filterList[i].value)){
                                clause += "NULL";
                            }
                            else{
                                clause += "\'" + filterList[i].value + "\'";
                            }
                            break;
                    };
                }
            }
            else if(filterList[i].dataType == "DATE"){
                clause += filterList[i].field;
                clause += " " + filterList[i].operator + " ";
                if($A.util.isEmpty(filterList[i].value)){
                    clause += "NULL";
                }
                else{
                    if(filterList[i].value.includes("/")){
                        var dateParts = filterList[i].value.split("/");
                        clause += dateParts[2] + "-" + dateParts[0] + "-" +  dateParts[1];
                    }
                    else{
                        var dateValue = filterList[i].value;
                        clause += helper.getDateFunctionClause(component, helper, dateValue);
                    }
                }
            }
            else if(filterList[i].dataType == "DATETIME"){
                if($A.util.isEmpty(filterList[i].value)){
                    clause += filterList[i].field;
                    clause += " " + filterList[i].operator + " ";
                    clause += "NULL";
                }
                else{
                    if(filterList[i].value.includes("/")){
                        if(filterList[i].value.includes(":")){
                            clause += filterList[i].field;
                            clause += " " + filterList[i].operator + " ";
                            var parts = filterList[i].value.split(" ");
                            var dateParts = parts[0].split("/");
                            clause += dateParts[2] + "-" + dateParts[0] + "-" +  dateParts[1] + "T";
                            var timeParts = parts[1].split(":");
                            if(parts[2].toLowerCase()=="pm"){
                                if(parseInt(timeParts[0])!=12){
                                    timeParts[0] = "" + parseInt(parseInt(timeParts[0]) + 12);
                                }
                            }
                            else{
                                if(parseInt(timeParts[0])==12){
                                    timeParts[1] = "00" ;
                                }
                            }
                            timeParts[0] = timeParts[0] < 10 ? "0" + timeParts[0] : timeParts[0];
                            clause += timeParts[0] + ":" + timeParts[1] + ":00" + "Z";
                        }
                        else{
                            var startDate=new Date();
                            var startDateString = "";
                            var endDate= new Date();
                            var endDateString = "";
                            var negativeOffset = false;
                            var offsetMilliseconds = parseInt(component.get("v.timeZoneOffset"));
                            if(offsetMilliseconds < 0){
                                offsetMilliseconds = offsetMilliseconds * -1;
                                negativeOffset = true;
                            }
                            var offsetTotalMinutes = offsetMilliseconds/(1000*60);
                            var offsetHours = offsetTotalMinutes/60;
                            var offsetMinutes = offsetTotalMinutes % 60;
                            
                            var offsetHourString = "";
                            var offsetMinuteString = "";
                            var dateParts = filterList[i].value.split("/");
                            if(negativeOffset){
                                offsetHourString = offsetHours < 10 ? "0"+ offsetHours : offsetHours;
                                offsetMinuteString = offsetMinutes < 10 ? "0"+ offsetMinutes : offsetMinutes;
                                
                                startDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[0]), parseInt(dateParts[1]));
                                endDate.setDate(startDate.getDate() + 1);
                                
                                var dd = endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate();
                                var mm = endDate.getMonth() + 1 < 10 ? "0" + parseInt(endDate.getMonth() + 1) : endDate.getMonth() + 1;
                                var y = endDate.getFullYear();
                                startDateString = dateParts[2] + "-" + dateParts[0] + "-" +  dateParts[1];
                                endDateString = y + "-" + mm + "-" +  dd;
                            }
                            else{
                                offsetHours = 24 - offsetHours;
                                offsetMinutes = 60 - offsetMinutes;
                                offsetHourString = offsetHours < 10 ? "0"+ offsetHours : offsetHours;
                                offsetMinuteString = offsetMinutes < 10 ? "0"+ offsetMinutes : offsetMinutes;
                                
                                endDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[0]), parseInt(dateParts[1]));
                                startDate.setDate(endDate.getDate() - 1);
                                
                                var dd = startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate();
                                var mm = startDate.getMonth() + 1 < 10 ? "0" + parseInt(startDate.getMonth() + 1) : startDate.getMonth() + 1;
                                var y = startDate.getFullYear();
                                endDateString = dateParts[2] + "-" + dateParts[0] + "-" +  dateParts[1];
                                startDateString = y + "-" + mm + "-" +  dd;
                            }
                            
                            var timeString = "T" + offsetHourString + ":" + offsetMinuteString + ":00Z";
                            endDateString = endDateString + timeString;
                            startDateString = startDateString + timeString;
                            
                            //Create clause based on the operator
                            if(filterList[i].operator == "=" || filterList[i].operator == "!="){
                                clause += filterList[i].field;
                                clause += filterList[i].operator == "=" ? ">=" : "<";
                                clause += startDateString;
                                clause += " AND ";
                                clause += filterList[i].field;
                                clause += filterList[i].operator == "=" ? "<" : ">";
                                clause += endDateString;
                            }
                            else if(filterList[i].operator == "<" || filterList[i].operator == ">="){
                                clause += filterList[i].field;
                                clause += filterList[i].operator == "<" ? "<" : ">=";
                                clause += startDateString;
                            }
                            else if(filterList[i].operator == ">" || filterList[i].operator == "<="){
                                clause += filterList[i].field;
                                clause += filterList[i].operator == ">" ? ">" : "<=";
                                clause += endDateString;
                            }
                        }
                    }
                    else{
                        clause += filterList[i].field;
                        clause += " " + filterList[i].operator + " ";
                        var dateValue = filterList[i].value;
                        clause += helper.getDateFunctionClause(component, helper, dateValue);
                    }
                }
            }
                else{
                    
                    /*
                    //skip from where clause if this field is present --> Aditya Update
                    if(filterList[i].field == "Number_Of_Times_Dialed__c"){
                        continue;
                    }
                    */
                    
                    /**********For NUMBER, INTEGER, CURRENCY, DOUBLE****/
                    clause += filterList[i].field;
                    clause += " " + filterList[i].operator + " ";
                    if($A.util.isEmpty(filterList[i].value)){
                        clause += "NULL";
                    }
                    else{
                        clause += filterList[i].value;
                    }
                }
            if(customFilterProvided){
                var j = Number(i)+1;
                j = "<"+j+">";
                whereClause = whereClause.replace(new RegExp(j,"g"),clause);
            }
            else{
                whereClause += clause;
            }
        }
        /*if($A.util.isEmpty(whereClause)){
            if(component.get("v.ownerFilterValue") == "MY"){
                whereClause = " USING SCOPE mine";
            }
        }
        else{
            if(component.get("v.ownerFilterValue") == "MY"){
                whereClause = " USING SCOPE mine WHERE " + whereClause;
            }
            else{
                whereClause = " WHERE " + whereClause;
            }
        }*/
        whereClause = " WHERE " + whereClause;
        //console.log(whereClause);
        component.set("v.whereClause",whereClause);
        helper.fireEventWithWhereClause(component, event, helper, whereClause);
    },
    
    fireEventWithWhereClause : function(component, event, helper, whereClause){
        //var whereClauseEvent = component.getEvent("DialPad_FilterInformationEvent");
        var whereClauseEvent = $A.get("e.c:Fina_FilterInformationEvent");
        whereClauseEvent.setParams({
            "whereClause" : whereClause
        });
        whereClauseEvent.fire();
    },
    
    showToast : function(component, event, helper,title, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "message": message
        });
        toastEvent.fire();
    },
    
    validateCustomFilterLogic : function(component, helper, customFilterLogic){
        //Remove all spaces from the expression before further processing
        var logic = customFilterLogic;
        logic = logic.replace(/ /g,"");
        var logic_copy = logic;
        var upperLimit = component.get("v.filters").length;
        //Return true if the string is empty - VALID STRING
        if(logic_copy.length==0){
            //alert("zero length stirng - ACCEPTED");
            return true;
        }
        //Return false if the string only contains numbers - INVALID STRING
        /*if(Number(logic_copy)>=0){
            alert("Only Numbers - REJECTED");
            return false;
        }*/
        
        //Return False if the expression contains only number and no operators
        if(!(logic_copy.includes("AND") || logic_copy.includes("OR"))){
            //alert("Only Numbers and brackets - REJECTED");
            //console.log(1);
            component.set("v.customFilterLogicDisplayMessage", component.get("v.SpellCheckError"));
            return false;
        }
        
        //Replace AND and OR with & and | respectively for easy processing
        logic_copy = logic_copy.replace(/AND/g,"&").replace(/OR/g,"|");
        
        //Return false if any of the following is not true
        //1. Before an operand there can either be nothing (starting of the string) or an operator (AND/OR) or an opening bracket.
        //2. Before an opening bracket there can either be nothing (starting of the string) or an operator (AND/OR) or another opening bracket.
        //3. Before an operator(AND/OR) there can either be an operand or a closing bracket
        //4. Before a closing bracket there can either be another closing bracket or an operand
        for(var i=0 ; i<logic_copy.length; i++){
            //Case 1 & 2 merged:-
            if(Number(logic_copy.charAt(i))>0 || logic_copy.charAt(i) == "("){
                var flag = false;
                if(i==0){//checking starting of the string
                    flag = true;
                }
                else{
                    /*if(logic_copy.charAt(i-1) == "&" || logic_copy.charAt(i-1) == "|" || logic_copy.charAt(i-1) == "("){//if there is an operator or an opening bracket
                        flag = true;
                    }*/
                    if(logic_copy.charAt(i-1) == "&" || logic_copy.charAt(i-1) == "|" 
                       || logic_copy.charAt(i-1) == "(" || (Number(logic_copy.charAt(i-1))>0 && Number(logic_copy.charAt(i))>0)){//if there is an operator or an opening bracket
                        flag = true;
                    }
                }
                if(!flag){
                    //alert("Invalid string as per Case 1 or 2");
                    //console.log(2);
                    component.set("v.customFilterLogicDisplayMessage", component.get("v.SpellCheckError"));
                    return false;
                }
            }
            
            //Case 3 & 4 merged:-
            if(logic_copy.charAt(i) == "&" || logic_copy.charAt(i) == "|" || logic_copy.charAt(i) == ")"){
                var flag = false;
                if(logic_copy.charAt(i-1) == ")" || Number(logic_copy.charAt(i-1))>0){//if there is an operator or an opening bracket
                    flag = true;
                }
                if(!flag){
                    //alert("Invalid string as per Case 3 or 4");
                    //console.log(3);
                    component.set("v.customFilterLogicDisplayMessage", component.get("v.SpellCheckError"));
                    return false;
                }
            }
        }
        
        //Return false if the string doesn't starts with number or ( and doesn't end with number or )- INVALID STRING
        //var regularExp = "^([1-"+upperLimit+"]|\().*([1-"+upperLimit+"]|\)$)";
        //var matchString = logic_copy.match(new RegExp(regularExp));
        //console.log(matchString);
        if((Number(logic_copy.charAt(0))>0 || logic_copy.charAt(0) == "(") && 
           (Number(logic_copy.charAt(logic_copy.length-1))>0 || logic_copy.charAt(logic_copy.length-1) == ")")){
            
        }
        else{
            //alert("string doesn't starts with number or ( and doesn't end with number or ) - REJECTED")
            //console.log(4);
            component.set("v.customFilterLogicDisplayMessage", component.get("v.SpellCheckError"));
            return false;
        }
        
        //Check If the string contains only numbers, "AND/OR" operators and brackets
        logic_copy=logic;
        logic_copy = logic_copy.replace(/AND/g,"").replace(/OR/g,"").replace(/\(/g,"").replace(/\)/g,"");
        
        if(Number(logic_copy)>10){
            //Check If the brackets are balanced
            logic_copy = logic;
            
            var stack = [];
            var numberInString = "";
            for(var i=0;i<logic_copy.length;i++){
                var poppedElement;
                if(logic_copy.charAt(i) == "("){
                    stack.push("(");
                }
                else{
                    if(logic_copy.charAt(i) == ")"){
                        if(stack.length>0){
                            poppedElement = stack.pop();
                        }
                        else{
                            //alert("Unbalanced brackets - REJECTED");
                            //console.log(5);
                            component.set("v.customFilterLogicDisplayMessage", component.get("v.UnbalancedParanthesisError"));
                            return false;
                        }
                    }
                }
                if(Number(logic_copy.charAt(i)) > 0){
                    
                    numberInString+=String(logic_copy.charAt(i));
                    //console.log("Number in Logic: " + numberInString);
                    if(Number(logic_copy.charAt(i+1)) > 0){
                        //numberInString+=String(logic_copy.charAt(i));
                    }
                    else{
                        //Return False if an invalid row number has been used - INVALID STRING
                        if(Number(numberInString) > upperLimit){
                            //alert("Number greater than the record limit entered - REJECTED")
                            //console.log(6);
                            component.set("v.customFilterLogicDisplayMessage", component.get("v.UsingUndefinedFilterError"));
                            return false;
                        }
                        numberInString = "";
                    }
                }
            }
        }
        else{
            //Return False If the string contains anything other than numbers, "AND/OR" operators and brackets - INVALID STRING
            //alert("string contains anything other than numbers, \"AND/OR\" operators and brackets - REJECTED")
            //console.log(7);
            component.set("v.customFilterLogicDisplayMessage", component.get("v.SpellCheckError"));
            return false;
        }
        //Return True if everything passes and the bracket are balanced - VALID STRING
        if(stack.length==0){
            return true;
        }
        //Return False if the brackets are not balanced - INVALID STRING
        //alert("Unbalanced brackets - REJECTED");
        //console.log(8);
        component.set("v.customFilterLogicDisplayMessage", component.get("v.UnbalancedParanthesisError"));
        return false;
    },
    
    transformFilterLogic : function(component,helper, customFilterLogic){
        for(var i in component.get("v.filters")){
            var j=Number(i)+1;
            customFilterLogic = customFilterLogic.replace(new RegExp(j, "g"), "<" + j + ">");
        }
        return customFilterLogic;
    },
    
    validateDateInput : function(component, helper, dateValue){
        if(dateValue.includes("/") && !dateValue.includes(":")){
            return helper.validateDate(component, helper, dateValue);
        }
        else if(dateValue.includes("/") && dateValue.includes(":")){
            var dateParts = dateValue.split(" ");
            if(dateParts.length==3){
                var dateResult = helper.validateDate(component, helper, dateParts[0]);
                //console.log("Date Result: "+dateResult);
                if(dateResult && (dateParts[2].toLowerCase() == "am" || dateParts[2].toLowerCase() == "pm")){
                    var time_regex = new RegExp(/^((0[1-9])|(1[0-2])):(([0-5])([0-9]))/);
                    var timeResult = time_regex.test(dateParts[1]);
                    return timeResult;
                    //console.log("Time Result: "+timeResult);
                }
                else{
                    //console.log("TIME invalid AM or PM missing ");
                    return false;
                }
            }
            else{
                //console.log("Date not 3 parts");
                return false;
            }
        }
        return false;
    },
    
    checkIfDateFunction : function(component, helper, dateValue){
        var availableFunctions = component.get("v.supportedDateFilters");
        var num = dateValue.match(/\d+/);
        if(num != null){
            dateValue = dateValue.replace(num[0],"n");
        }
        if(availableFunctions.includes(dateValue)){
            return true;
        }
        else{
            return false;
        }
    },
    
    validateDate : function(component, helper, dateValue){
        var date_regex = new RegExp(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/);
        var regExResult = date_regex.test(dateValue);
        if(regExResult){
            var arr = dateValue.split("/");
            if(arr[0] == "04" || arr[0] == "06" || arr[0] == "09" || arr[0] == "11"){
                regExResult= arr[1] > 30 ? false : regExResult;
            }
            if(arr[0] == "02"){
                //A leap year is exactly divisible by 4 except for century years (years ending with 00). The century year is a leap year only if it is perfectly divisible by 400.
                var divisor = arr[2].endsWith("00") ? 400 : 4;
                var leapYear = Number(arr[2]) % divisor == 0 ? true : false;
                if(leapYear){
                    regExResult= arr[1] > 29 ? false : regExResult;
                }
                else{
                    regExResult= arr[1] > 28 ? false : regExResult;
                }
            }
        }
        return regExResult;
    },
    
    validateTime : function(component, helper, timeValue){
        if(timeValue[1].toLowerCase == "am" || timeValue[1].toLowerCase == "pm"){
            var time_regex = new RegExp(/^((0[1-9])|(1[0-2])):(([0-5])([0-9]))/);
            var regExResult = date_regex.test(timeValue[0]);
            return regExResult;
        }
        else{
            return false;
        }
    },
    
    getDateFunctionClause : function(component, helper, dateValue){
        var num = dateValue.match(/\d+/);
        if(num != null){
            dateValue = dateValue.replace(num[0],"n");
        }
        switch(dateValue){
            case "YESTERDAY" : return "YESTERDAY";
                break;
            case "TODAY" : return "TODAY";
                break;
            case "TOMORROW" : return "TOMORROW";
                break;
            case "LAST WEEK" : return "LAST_WEEK";
                break;
            case "THIS WEEK" : return "THIS_WEEK";
                break;
            case "NEXT WEEK" : return "NEXT_WEEK";
                break;
            case "LAST n WEEKS" : return "LAST_N_WEEKS:"+ num;
                break;
            case "NEXT n WEEKS" : return "NEXT_N_WEEKS:"+ num;
                break;
            case "n WEEKS AGO" : return "N_WEEKS_AGO:"+num;
                break;
            case "LAST MONTH" : return "LAST_MONTH";
                break;
            case "THIS MONTH" : return "THIS_MONTH";
                break;
            case "NEXT n MONTHS" : return "NEXT_N_MONTHS:"+ num;
                break;
            case "LAST n MONTHS" : return "LAST_N_MONTHS:"+ num;
                break;
            case "n MONTHS AGO" : return "N_MONTHS_AGO:"+num;
                break;
            case "NEXT MONTH" : return "NEXT_MONTH";
                break;
            case "LAST 90 DAYS" : return "LAST_N_DAYS:90";
                break;
            case "NEXT 90 DAYS" : return "NEXT_N_DAYS:90";
                break;
            case "LAST n DAYS" : return "LAST_N_DAYS:"+ num;
                break;
            case "NEXT n DAYS" : return "NEXT_N_DAYS:"+ num;
                break;
            case "n DAYS AGO" : return "N_DAYS_AGO:"+num;
                break;
            case "LAST QUARTER" : return "LAST_QUARTER";
                break;
            case "THIS QUARTER" : return "THIS_QUARTER";
                break;
            case "NEXT QUARTER" : return "NEXT_QUARTER";
                break;
            case "LAST n QUARTERS" : return "LAST_N_QUARTERS:"+num;
                break;
            case "NEXT n QUARTERS" : return "NEXT_N_QUARTERS:"+num;
                break;
            case "n QUARTERS AGO" : return "N_QUARTERS_AGO:"+num;
                break;
            case "LAST YEAR" : return "LAST_YEAR";
                break;
            case "THIS YEAR" : return "THIS_YEAR";
                break;
            case "NEXT YEAR" : return "NEXT_YEAR";
                break;
            case "n YEARS AGO" : return "N_YEARS_AGO:"+num;
                break;
            case "LAST n YEARS" : return "LAST_N_YEARS:"+num;
                break;
            case "NEXT n YEARS" : return "NEXT_N_YEARS:"+num;
                break;
            case "NOW" : return ':NOW';
                break;
                
        }
       
    }
})