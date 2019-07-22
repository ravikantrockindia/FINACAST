({
    createIncome : function(component) {
        component.set("v.disabled",false)
        
        var primaryOwner=component.get("v.recordId")
        var recordTypeId=component.get("v.recordTypeId")
      //  lastKey=lastKey+1;
        var data=component.get("v.IncomeList")
   
        var a= {"income":{"Id":null,"Primary_Owner__c":primaryOwner,"Name":"","Frequency__c":"None","RecordTypeId":recordTypeId,"Yearly_growth__c":"","End_Date__c":"","Amount__c":"","Start_Date__c":"","Tax_Rate__c":""},"disabled":false};
        var incomeList=component.get("v.IncomeList");
        
        incomeList.push(a);
        component.set("v.IncomeList", incomeList);
        console.log(JSON.stringify(incomeList))
     //   component.set("v.LastKey", lastKey);
        
    },
    validateDate: function(component){
                var data=component.get("v.IncomeList")

        var isAllValid=true;
         var enddate=component.find('enddate');
        // var startdate=component.find('startdate');
        if(data.length>1){
            isAllValid = enddate.reduce(function(isValidSoFar, inputCmp){
                //display the error messages
                // console.log("abc")
                inputCmp.showHelpMessageIfInvalid();
                //check if the validity condition are met or not.
                return isValidSoFar && inputCmp.checkValidity();
            },true);
        }
        else{
            
            isAllValid =enddate.get("v.validity").valid
            
            //display the error messages
            console.log(isAllValid)
            enddate.showHelpMessageIfInvalid();
            //  enddate.setCustomValidity('My error message') ;
            //  console.log(enddate.get("v.validity").valid)
            // enddate.reportValidity();
            
            
        }
        for (var e in data ){
            var startdate=data[e]["income"]["Start_Date__c"]
            console.log(startdate)
            if($A.util.isUndefinedOrNull(startdate) || startdate==""){
                
                var dt=new Date();
                var date= dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
                // date.format("yyyy/mm/dd");
                console.log(date)
                
                data[e]["income"]["Start_Date__c"]=date;
            }
        }
        component.set("v.IncomeList",data)
        
        var startdate=component.find('startdate');
        
        
        if(data.length>1){
            for(var i=0;i<enddate.length;i++){
                var edate=enddate[i].get("v.value")
                var edateName=enddate[i].get("v.name")
                console.log(edateName)
                if(!($A.util.isUndefinedOrNull(edate) && edate=="")){
                    for(var j=0;j<startdate.length;j++){
                        var sdate=startdate[i].get("v.value")
                        var sdateName=startdate[i].get("v.name")
                        console.log(sdateName)
                        var edateIndex=edateName.split("_")[1]
                        console.log('index', edateIndex)
                        var sdateIndex=sdateName.split("_")[1]
                        console.log('index',sdateIndex)
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
        else{
            var edate=enddate.get("v.value")
            if(!($A.util.isUndefinedOrNull(edate) && edate=="")){
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
        
        
}
})