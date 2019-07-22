({
    doInit: function(component, event, helper) {
         var action = component.get("c.ColumnSet");
        
        action.setCallback(this,function(response) {
 
                // component.set("v.options", response.getReturnValue().lstFields);     
                var plValues = [];
               
            	
                for (var i = 0; i <  response.getReturnValue().lstFields.length; i++) {

                    if(response.getReturnValue().lstFields[i].fieldName !='name' ) {
                           plValues.push({
                            
    
                            label:response.getReturnValue().lstFields[i].label,
    
                            value:response.getReturnValue().lstFields[i].fieldName
    
                        }); 
                    }
                    
						component.set("v.options",plValues);
                    	
                }          
        });
       
        $A.enqueueAction(action);
    },
    
    openModel: function(component, event, helper) {
        // for Display Model,set the "isOpen" attribute to "true"
        component.set("v.isOpen", true);
    },
    
    
    closeModel: function(component, event, helper) {
        
        //for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        component.set("v.isOpen", false);
        var showColumns = component.get("v.selectedValues");
        console.log('showColumns'+showColumns);
        //var columns = component.get("v.allCol");
        //var columnsDisplay = component.get("v.allColDisplay");
        
        var newColumns = [];
        var originalColumns = JSON.parse(JSON.stringify(component.get("v.allCol")));
        //console.log('originalColumns'+JSON.stringify(originalColumns));
        
     
        newColumns.push({
            "label" :  'NAME',
            "fieldName" : 'linkName',
            "sortable" : 'true',
            "type" :  'url',
            "typeAttributes" :  {
                label: { fieldName: 'Name' },
                target: '_blank'}
        });
        for(var i in showColumns){
            for(var j in originalColumns){
                if(originalColumns[j].fieldName == showColumns[i]){
                    newColumns.push(originalColumns[j]);
                }
            }
        }

        console.log('newColumns'+newColumns);
        component.set('v.allColDisplay', newColumns);
        
        var action = component.get("c.saveColumns");
        action.setParams({
            'getSelectedColumns': showColumns.join(',')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                
            }
        });
        $A.enqueueAction(action);
    },
    
    closeModelCross: function(component, event, helper) {
        component.set("v.isOpen", false);
    },
   handleChange: function (cmp, event) {
        // This will contain an array of the "value" attribute of the selected options
       
    }
})