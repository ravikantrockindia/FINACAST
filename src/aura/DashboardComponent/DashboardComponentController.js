/**** Developer Name: Aditya Kaushal, Winter 18 ****/

({
    //init method
    doInit : function(component, event, helper) {               
        var jsonResponseJs;       
        var action = component.get("c.getData");
        
        action.setParams({
            id: 'init'
        });
        action.setCallback(this, function(response){
            var g = response.getReturnValue();
            console.log('Response in Dashboard in init: ' + JSON.stringify(g));
            console.log("Name:" + g.firstClient);
            console.log(g.responseData);
            
            var state = response.getState();
            if(state==="SUCCESS" && (!($A.util.isUndefinedOrNull(g)))) {
                
                //check for client
                if(!($A.util.isUndefinedOrNull(g.firstClient))) {
                    component.set("v.client.Name", g.firstClient); }
                
                //set saving, credit, loan, networth
                component.set('v.saving', g.financialAccountList['0']);
                component.set('v.credit', g.financialAccountList['1']);
                component.set('v.loan', g.financialAccountList['2']);
                var netWorth = g.balanceList['0'] - (g.balanceList['1'] + g.balanceList['2']);
                component.set('v.netWorth', netWorth);
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
        })//end set callback
        
        $A.enqueueAction(action);        
    },
    
    //change client method
    changeClient: function(component, event, helper) {
        
        helper.indicatorColorRemove(component);
        var jsonResponseJs;
        var selectedClient =  component.get("v.selectedLookUpRecord");  
        component.set("v.client", selectedClient);
        var action = component.get("c.getData");
        console.log('client id: '+ selectedClient.Id);
        action.setParams({
            id: selectedClient.Id
        });
        action.setCallback(this, function(response) {
            var g = response.getReturnValue();
            console.log("Future Simulation Response on change client: " + JSON.stringify(g));
            var state = response.getState();
            
            if(state==="SUCCESS" && (!($A.util.isUndefinedOrNull(g)))) {
                
                //set loan, credit, saving, networth, goals
                component.set('v.saving', g.financialAccountList['0']);
                component.set('v.credit', g.financialAccountList['1']);
                component.set('v.loan', g.financialAccountList['2']);
                var netWorth = g.balanceList['0'] - (g.balanceList['1'] + g.balanceList['2']);
                component.set('v.netWorth', netWorth);
                component.set("v.GoalsList", g.financialGoalList);
                
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
        })
        $A.enqueueAction(action);
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
    }
    
    
    /* getHealthScore: function(component, event, helper) {
   			 data = response.getReturnValue().response;
            data = JSON.parse(data);
            offset = data.offset;
            component.set("v.year", offset);
            component.set("v.client",response.getReturnValue().clientAcc);
            var d1 = new Array();
            for(var i = 0 ; i < data.financialHealthAnalysis.length ; i++){
                d1.push([(offset+i), data.financialHealthAnalysis[i].score]);
                chartLabels.push(offset+i);
                chartDataSet.push(data.financialHealthAnalysis[i].score.toPrecision(2));
            }
            
            var greenGoalMsg=false;
            var greenGoalMsgCounter=-1;
            var diagnosis = data;
            var tafiScore = diagnosis.financialHealthAnalysis[0];
            var messages = new Array();
            if(tafiScore.greenMessage != null && tafiScore.greenMessage != undefined){
                messages.push({type:0, message:tafiScore.greenMessage});
                if(tafiScore.greenMessage.indexOf("goal")>0){
                    greenGoalMsg=true;
                    greenGoalMsgCounter++;
                }
            }
            if(tafiScore.redMessage != null && tafiScore.redMessage != undefined){
                messages.push({type:1, message:tafiScore.redMessage});
                if(tafiScore.redMessage.indexOf("goal")>0){
                    greenGoalMsg=false;
                    greenGoalMsgCounter++;
                }
            }
            if(tafiScore.surviveMessage != null && tafiScore.surviveMessage != undefined){
                messages.push({type:2, message:tafiScore.surviveMessage});
            }
			
            //set financial Health Message
            component.set("v.financialHealthMessage", messages);           
            component.set("v.score",chartDataSet[0]);
            component.set("v.data",data);
			}*/
})