({
   debtAnalysis : function(component) {
       
        var data = component.get("v.Tabledata");
              data = JSON.parse(data);
         var viewingOption=component.get("v.futureselectedValue");
        
        var objectDisplay ='';
        if(viewingOption=='buy'){
            objectDisplay=data.simulationData.avatarData;
        }else if(viewingOption=='nobuy'){
            objectDisplay=data.simulationData.profileData;
        }else if(viewingOption=='recommend'){
            objectDisplay=data.simulationData.recommendData;
        }    
        var element = objectDisplay.debtAnalysis;
        var messages = new Array();
        var shortTermFlag = 0, shortTermDefault = 0;
        var longTermFlag = 0, longTermDefault = 0;
        var interestAccumulated = 0;
        var selected = 'All';    
        var currSymbol='$';
        //console.log("inside Debt analysis");
        if(selected == 'All') {
            shortTermFlag = parseInt(element.shortTermFlag);
            longTermFlag = parseInt(element.longTermFlag);
            if(longTermFlag > 0) {
                //console.log('longTermFlag',longTermFlag);
                messages.push({type:"default",termDebt:true, message:"You are likely to default on one or more of your long term loan payments.",showSeeHow:true});
            } else {
                messages.push({type:"none", termDebt:true, message:"Congratulations! You are likely to pay off your long term loan commitments on time.",showSeeHow:false});
            }
            interestAccumulated = parseFloat(element.interestOnDebt).toFixed(2);
           // console.log('1')
            if(shortTermFlag == 0){
               // console.log('2')
                
                messages.push({type:"none",termDebt:false, message:"Congratulations! You are likely to meet all your short term loan commitments in the next 10 years and not incur any interest charge",showSeeHow:false});
            } else if(shortTermFlag == 1) {
               // console.log('3')
                
                messages.push({type:"none",termDebt:false, message:"You are likely to meet the minimum payments on your short term loans and  credit cards",showSeeHow:false});
                messages.push({type:"interest",termDebt:false, message:"You are likely to incur an interest charge on your short term debt payments amounting to "+ currSymbol +interestAccumulated+" in next 10 years.",showSeeHow:true});
            } else {
              //  console.log('4')
                
                messages.push({type:"default",termDebt:false, message:"You are likely to default on one or more of your credit cards in next 10 years.",showSeeHow:true});                                              
                messages.push({type:"interest",termDebt:false, message:"In addition you are likely to incur an interest charge amounting to "+currSymbol+interestAccumulated+" in next 10 years for non term debts.",showSeeHow:true});
                
            }
            //console.log('5')
            
        } else {
            var element2, element3, element4;
            for(var i=0; i<element.yearlyData.length; i++){
                element2 = element.yearlyData[i].monthlyDebts;
                for(var j=0; j<element2.length; j++){
                    element3 = element2[j];
                    for(var k=0; k<element3.length; k++){
                        element4 = element3[k];
                        if(element4.name == selected){
                            if(element4.item.termDebt){
                                longTermFlag++;
                                if(element4.item.paymentDefault){
                                    longTermDefault++;
                                }
                            } else {
                                shortTermFlag++;
                                if(element4.item.paymentDefault){
                                    shortTermDefault++;
                                }
                                interestAccumulated += element4.item.interestAccumulated;
                            }
                        }
                    }
                }
            }
            if(longTermFlag>0){
                if(longTermDefault > 0){
                    messages.push({termDebt:true, message:("You are likely to default on "+selected+" payments. <span onClick='showDefaultAlertTable(event, true);' style='float: none; cursor: pointer;'>(See How)</span>")});
                } else {
                    messages.push({termDebt:true, message:"Congratulations! You are likely to pay off your long term loan commitments on time."});
                }
            }
            
            if(shortTermFlag>0){
                if(shortTermDefault == 0 && interestAccumulated <= 0){
                    messages.push({termDebt:false, message:"Congratulations! You are likely to meet all your "+selected+" payments in the next 10 year payments and not incur any interest charge"});
                } else if(shortTermDefault == 0 && interestAccumulated > 0) {
                    messages.push({termDebt:false, message:"You are likely to meet the minimum payments on "+selected});
                    messages.push({termDebt:false, message:("You are likely to incur an interest charge on your "+selected+" payments amounting to "+ currSymbol +interestAccumulated.toFixed(2)+" in next 10 years.<span onClick='showInterestAlertTable(event);' style='float: none; cursor: pointer;'>(See How)</span>")});
                } else {
                    messages.push({termDebt:false, message:("You are likely to default on "+selected+" payments.  <span onClick='showDefaultAlertTable(event, false);' style='float: none; cursor: pointer;'>(See How)</span>")});
                    messages.push({termDebt:false, message:("In addition you are likely to incur an interest charge amounting to "+ currSymbol +interestAccumulated.toFixed(2)+" in next 10 years.<span onClick='showInterestAlertTable(event);' style='float: none; cursor: pointer;'>(See How)</span>")});
                }
            }
        }
        //console.log('messages',messages);
        component.set("v.debtStatus", messages);
    },
})