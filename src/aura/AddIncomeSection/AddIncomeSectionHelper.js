({
    createIncome : function(component) {
        component.set("v.disabled",false)
        var primaryOwner=component.get("v.recordId")
        
        
        var action=component.get("c.addIncome");
        action.setParams({ recordId : primaryOwner });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var incomeList=component.get("v.IncomeList");
                
                var a=response.getReturnValue();
                
                
                incomeList.push(a);
                component.set("v.IncomeList", incomeList);
                
            }
            else if (state === "INCOMPLETE") {
                // do something
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
    validateDate: function(component){
    //    var data=component.get("v.IncomeList")
        
        var isAllValid=true;
        var enddate=component.find('enddate');
        
        /*if(enddate.length>0){
            isAllValid = enddate.reduce(function(isValidSoFar, inputCmp){
                
                inputCmp.showHelpMessageIfInvalid();
                return isValidSoFar && inputCmp.checkValidity();
            },true);
        }
        else{
            
            isAllValid =enddate.get("v.validity").valid
            
            enddate.showHelpMessageIfInvalid();
            
        }*/
       /* for (var e in data ){
            var startdate=data[e]["income"]["startDate"]
            if($A.util.isUndefinedOrNull(startdate) || startdate==""){
                
                var dt=new Date();
                var date= dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
                
                data[e]["income"]["startDate"]=date;
            }
        }
        component.set("v.IncomeList",data)*/
        
        var startdate=component.find('startdate');
        
        
        if(enddate.length>0){
            for(var i=0;i<enddate.length;i++){
                var edate=enddate[i].get("v.value")
                var edateName=enddate[i].get("v.name")
                if(!($A.util.isUndefinedOrNull(edate) && edate=="")){
                    for(var j=0;j<startdate.length;j++){
                        var sdate=startdate[i].get("v.value")
                        var sdateName=startdate[i].get("v.name")
                        var edateIndex=edateName.split("_")[1]
                        var sdateIndex=sdateName.split("_")[1]
                        if(!($A.util.isUndefinedOrNull(sdate) && sdate=="")){
                            if(edateIndex==sdateIndex){
                                if(new Date(sdate)>new Date(edate)){
                                    enddate[i].setCustomValidity("End date cannot be less than start date")
                                    isAllValid=false
                                }
                                else{
                                    enddate[i].setCustomValidity("")
                                }
                                enddate[i].reportValidity();
                                
                            }
                        }
                    }
                }
            }
        }
        else{
            var edate=enddate.get("v.value")
            if(!($A.util.isUndefinedOrNull(edate) && edate=="") && !($A.util.isUndefinedOrNull(sdate) && sdate=="")){
                if(new Date(startdate.get("v.value"))>new Date(edate)){
                    enddate.setCustomValidity("End date cannot be less than start date")
                    isAllValid=false;
                    enddate.reportValidity();
                }
                else{
                    enddate.setCustomValidity("")
                    enddate.reportValidity();  
                }
                
                
            }
        }
        return isAllValid;
        
        
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
})