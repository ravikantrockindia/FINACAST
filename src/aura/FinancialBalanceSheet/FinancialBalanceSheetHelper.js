({
	getAllAccounts : function(component) {
		var action=component.get('c.getAccounts');
        action.setParams({
            ClientId: component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data=response.getReturnValue();
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
     }

})