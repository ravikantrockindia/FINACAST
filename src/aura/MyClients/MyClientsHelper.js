({
    setDisplayColumns : function(component, event, helper, showColumns){
        
        if(showColumns.length > 0){
            var newColumns = [];
            var originalColumns = JSON.parse(JSON.stringify(component.get("v.mycolumns")));
            
            newColumns.push({label: 'Client Name', fieldName: 'linkName',sortable : 'true', type: 'url' , typeAttributes:  
                             {label: { fieldName: 'Name' }, target: '_blank' , name: 'details',variant:'Base'}  });
            for(var i in showColumns){
                for(var j in originalColumns){
                    if(originalColumns[j].fieldName == showColumns[i]){
                        newColumns.push(originalColumns[j]);
                    }
                }
            }            
            component.set('v.myColumnsDisplay', newColumns);
        }
        else{
            component.set('v.myColumnsDisplay', JSON.parse(JSON.stringify(component.get("v.mycolumns"))));
        }
        
        console.log('newColumns'+JSON.stringify(newColumns));
    },
    sortData : function(component,helper,fieldName,sortDirection){
        var data = component.get("v.allData");     
        var reverse = sortDirection != 'asc';
        if(fieldName == 'linkName'){
            fieldName = 'Name';
        }
        data.sort(this.sortBy(fieldName, reverse))
        component.set("v.allData",data);
        helper.buildData(component, helper);
    },
    sortBy: function (field, reverse, primer) {
        var key = primer ?
            function(x) {return primer(x[field])} :
        function(x) {return x[field]};
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    },
    
    /*
     * this function will build table data
     * based on current page selection
     * */
    buildData : function(component, helper) {
        var data = [];
        var pageNumber = component.get("v.currentPageNumber");
        var pageSize = component.get("v.pageSize");
        var allData = component.get("v.allData");
        var x = (pageNumber-1)*pageSize;
        var y = (pageNumber-1)*pageSize;
        component.set("v.offset", y);
        //creating data-table data
        for(; x<(pageNumber)*pageSize; x++){
            
            if(allData[x]){
                data.push(allData[x]);                 
            }
        }
       
        component.set("v.listDetails", data);
        
        helper.generatePageList(component, pageNumber);
    },
    
    /*
     * this function generate page list
     * */
    generatePageList : function(component, pageNumber){
        pageNumber = parseInt(pageNumber);
        var pageList = [];
        var totalPages = component.get("v.totalPages");
        console.log('totalPages---'+totalPages);
        if(totalPages > 1){
            if(totalPages < 10){
                var counter = 2;
                for(; counter < (totalPages); counter++){
                    pageList.push(counter);
                } 
            } else{
                if(pageNumber < 5){
                    pageList.push(2, 3, 4, 5, 6);
                } else{
                    if(pageNumber>(totalPages-5)){
                        pageList.push(totalPages-5, totalPages-4, totalPages-3, totalPages-2, totalPages-1);
                    } else{
                        pageList.push(pageNumber-2, pageNumber-1, pageNumber, pageNumber+1, pageNumber+2);
                    }
                }
            }
        }
        component.set("v.pageList", pageList);
    },
    
    obtainFilter : function(component, event, helper){
        var filterWhereClause = event.getParam("whereClause");       
        component.set("v.getFilterByEvent", filterWhereClause);
        var action = component.get("c.ColumnSet1");
        action.setParams({ 
            whereClause : filterWhereClause            
        });
        action.setCallback(this, function(response) {
            var state =response.getState();
             if (state === "SUCCESS") {
             // hide spinner when response coming from server 
            component.find("Id_spinner").set("v.class" , 'slds-hide');
            var allFieldList = response.getReturnValue().lstFields;var ListWrapper = response.getReturnValue(); 
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
            
            data.forEach(function(record){
                record.linkName = '/'+record.Id;
                console.log("test"+ record.linkName);
            });
            
            component.set("v.totalPages", Math.floor(data.length/component.get("v.pageSize")));            
            component.set("v.allData", data );  
            component.set("v.currentPageNumber",1);
            helper.buildData(component, helper);
             } 
        });
        
        $A.enqueueAction(action);
    },
    
})