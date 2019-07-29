({
    //init method
    doInit : function(component, event, helper) {    
        var action = component.get("c.returnNamespace");
        action.setCallback(this, function(response){
             var state = response.getState();
            if(state=="Sucess"){
                 var namespace = response.getReturnValue();
                component.set("v.NameSpace", namespace);
            }
            
        });
        
        var jsonResponseJs;      
        console.log('recordId---------'+ component.get('v.recordId')); 
        console.log('NameSpace---------'+ component.get('v.NameSpace'));
        var eve = $A.get("e.c:changeclientevent");
        eve.setParams({"idclient":component.get('v.recordId'),
                       "NameSpace":component.get('v.NameSpace')
                      }); 
        eve.fire();
        console.log("ee"+component.get('v.recordId'));
        var action = component.get("c.getData");
        action.setParams({
            id: component.get('v.recordId')
        });
           action.setCallback(this, function(response){
            try{
                var g = response.getReturnValue();
            console.log('Response in Dashboard in init: ' + JSON.stringify(g));
            console.log("Name:" + g.firstClient);
            console.log(g.responseData);
            
            var state = response.getState();
            if(state==="SUCCESS"&& (!($A.util.isUndefinedOrNull(g)))) {
               
                //check for client
                if(!($A.util.isUndefinedOrNull(g.firstClient))) {
                    var s= g.firstClient;
                    console.log('sssss'+s);
                    component.set("v.client.Name", g.firstClient); 
                    console.log("rrrrrrrrrrrr"+g.firstClient);
                    component.set("v.selectedClient",g.clientid); 
                }
                
              
                component.set("v.GoalsList", g.financialGoalList);
                component.set("v.isPortalUser", g.isportalUser); 
                
                //Health score comes here
                jsonResponseJs = JSON.parse(g.responseData);
                component.set('v.score', jsonResponseJs.score);
                component.set('v.months',jsonResponseJs.months);
                var alertArray = [];
                alertArray.push(jsonResponseJs.greenMessage);
                alertArray.push(jsonResponseJs.surviveMessage);
                alertArray.push(jsonResponseJs.redMessage);
                component.set('v.alertMessages', alertArray);
                console.log('Js Alert Messages', alertArray);
               
                //code for indicators
                helper.indicatorColorChange(component, jsonResponseJs.score);
            }
            else {
                alert("Create Data"); }
            } 
            //end set callback
         catch(e)
            {
               /* console.log(e);
                var event = $A.get("e.force:showToast");
                                            event.setParams({
                                                "type" : "Warnning",
                                                "title" : "Info !",
                                                "message" : "No Data for client Available"
                                            });
                                            event.fire(); */
            }
              
        });
         $A.enqueueAction(action); 
    },
    
    //change client method
  changeClient: function(component, event, helper) {
        
        helper.indicatorColorRemove(component);
        var jsonResponseJs;
           var selectedClient =   component.find("inf1").get("v.value");
            console.log('fgfgyfgfgy'+ selectedClient);        
          var eve = $A.get("e.c:changeclientevent");
      

        eve.setParams({"idclient":selectedClient});
       
        
         eve.fire();
       
       
        
         if(!$A.util.isEmpty(selectedClient))
         {
        var action = component.get("c.getData");
        console.log('client id: '+ selectedClient.Id); 
        action.setParams({
            id: selectedClient.toString()
        });
        action.setCallback(this, function(response) {
            try{
                 component.set("v.client.Name",selectedClient.Name);
            var g = response.getReturnValue();
            console.log("Future Simulation Response on change client: " + JSON.stringify(g));
            var state = response.getState();
            
            if(state==="SUCCESS" && (!($A.util.isUndefinedOrNull(g)))) {
                
                //set loan, credit, saving, networth, goals
          
                component.set("v.isPortalUser", g.isportalUser); 
                component.set("v.GoalsList", g.financialGoalList);
               
                // component.set("v.IncomesList" , g.financialincomeList);
              //  component.set("v.ExpensesList" , g.financialexpenseList);
                
                
                
                //Health score comes here
                jsonResponseJs = JSON.parse(g.responseData);
                component.set('v.score', jsonResponseJs.score);
                component.set('v.months',jsonResponseJs.months);
                var alertArray = [];
                alertArray.push(jsonResponseJs.greenMessage);
               alertArray.push(jsonResponseJs.surviveMessage);
                alertArray.push(jsonResponseJs.redMessage);
                console.log('Alert Array: '+alertArray);
                component.set('v.alertMessages', alertArray);
                
                //code for indicators
                console.log(jsonResponseJs.score);
                helper.indicatorColorChange(component, jsonResponseJs.score);
            }
            else { helper.showToast(component, selectedClient.Name);} 
            }
            catch(e)
            {
                
            }            })
        $A.enqueueAction(action);
         }
    },
    
 
    //for alert messages open and close
    showAlert: function(component, event, helper) {
        var flag = component.get('v.showAlert');
        if(flag){
            component.set("v.showAlert",false);}
        else{
            component.set("v.showAlert", true);}
    },
    
    //method to open pop up 
    showDetails: function(component, event, helper) {
        component.set("v.showModal", true);
    },
     changeClientName :function(component,event,helper){
        console.log(component.find("inf1").get("v.value"));
    }

    
  })