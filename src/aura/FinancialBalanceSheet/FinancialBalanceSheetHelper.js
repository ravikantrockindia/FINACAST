({
    getAllAccounts : function(component) {
        var action=component.get('c.getAccounts');
        action.setParams({
            ClientId: component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                var data=JSON.parse(JSON.stringify(response.getReturnValue()).replace(/Finsol__/g,""));
                component.set("v.cash", data.cashAccountList);
                component.set("v.investment", data.investmentAccountList);
                component.set("v.credit", data.creditAccountList);
                component.set("v.loan", data.loanAccountList);
                component.set("v.cashvalue", data.cashAmount);
                component.set("v.investmentvalue",data.investmentAmount);
                component.set("v.loanvalue", data.loanAmount);
                component.set("v.creditvalue", data.creditAmount);
                var networth=0;
                networth=data.cashAmount+data.investmentAmount - data.creditAmount -data.loanAmount;
                component.set("v.netWorth", networth);
                var AccTrue=component.get("v.isAccount");
                console.log('AccTrue'+AccTrue);
                if(AccTrue){
                    
                    var FinaId=null;
                    
                    if(data.cashAccountList.length>0){
                        FinaId= data.cashAccountList[0].Id;
                      /*  var sectionDiv = component.find('cashSection');
                        
                        $A.util.removeClass(sectionDiv, 'slds-is-collapsed');
                        $A.util.addClass(sectionDiv, 'slds-is-expanded');
                        var button=component.find("cashSectionButton");
                        button.set("v.iconName",'utility:chevrondown');*/
                        
                    }else if(data.creditAccountList.length>0){
                        FinaId= data.creditAccountList[0].Id;
                        
                      /*  var sectionDiv = component.find('creditSection');
                        
                        $A.util.removeClass(sectionDiv, 'slds-is-collapsed');
                        $A.util.addClass(sectionDiv, 'slds-is-expanded');
                        var button=component.find("creditSection");
                        button.set("v.iconName",'utility:chevrondown');*/
                        
                    }else if(data.investmentAccountList.length>0){
                        FinaId= data.investmentAccountList[0].Id;
                        
                        var sectionDiv = component.find('investmentSection');
                        
                        $A.util.removeClass(sectionDiv, 'slds-is-collapsed');
                        $A.util.addClass(sectionDiv, 'slds-is-expanded');
                        var button=component.find("investmentSection");
                        button.set("v.iconName",'utility:chevrondown');
                        
                    }else if(data.loanAccountList.length>0){
                        FinaId= data.loanAccountList[0].Id;
                        var sectionDiv = component.find('loanSection');
                        
                        $A.util.removeClass(sectionDiv, 'slds-is-collapsed');
                        $A.util.addClass(sectionDiv, 'slds-is-expanded');
                        var button=component.find("loanSection");
                        button.set("v.iconName",'utility:chevrondown');
                        
                    } 
                    console.log('BeforeFinaIdhelper',FinaId);
                    component.set("v.FinaId",FinaId);
                    this.handleFinaID(component);  
                    console.log('afterFinaIdhelper',FinaId);
                    component.set("v.FinaId",FinaId);
                }
                
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        
        $A.enqueueAction(action); 
    },
    showNotfication : function(component,msg,type,title){
        try{
            component.find('notifLib').showToast({
                "title": title,
                "variant":type,
                "message": msg,
                "mode":"dismissable"
            });
            
        }catch(e){
            console.log(e.message)
        }
    },
    showToast : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type":"success",
            "title": "Success!",
            "message": "The record has been deleted successfully."
        });
        toastEvent.fire();
    },
    handleFinaID: function(component){
        var  FinaId=component.get("v.FinaId");
        console.log('handle FinaId '+FinaId);
        var cmpEvent = component.getEvent("rTid");
        cmpEvent.setParams( { "eTid" :  FinaId} );
        cmpEvent.fire();  
    },
    
})