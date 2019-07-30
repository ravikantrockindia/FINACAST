({
    emptyCheck: function(component, obj){
        if($A.util.isUndefinedOrNull(obj.debtItems) || $A.util.isUndefinedOrNull(obj.debtPayed)){
            return true;
        }
           
        if(obj.debtItems == 0 && obj.debtPayed.length == 0){
            return true;
        }
            return false;
        /*for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;*/ 
    },
    
    showDebtForecast : function(component) {
        var data;
        var offset;
        var d1 = new Array();
        var chartLabels = new Array();
        var chartDataSet = new Array();
        var shortTermYearlyInterest = new Array();
        var debtList = new Array();
        var debtList2 = new Array();
        var dataSeriesDebt = new Array();
        var selected ="All";
        var flag = true;
        var tempArray;
        var startYear = 0;
        var endYear = -1;
      
        try{
            //intially set the the values
            var data = component.get("v.data");
            //console.log('offset' + data.offset);
            if(!$A.util.isUndefinedOrNull(data.offset)){}
            offset = data.offset;
            component.set("v.year", offset);
            var longtermInterest;
            var shorttermInterest;
            var currentDebtsAnalysisYear = component.get("v.year");
            //console.log('currentDebtsAnalysisYear '+ currentDebtsAnalysisYear);
            
            if(!$A.util.isUndefinedOrNull(data.debtAnalysis.yearlyData[currentDebtsAnalysisYear-offset].interestOnTermDebt))  
                longtermInterest = (parseFloat(data.debtAnalysis.yearlyData[currentDebtsAnalysisYear-offset].interestOnTermDebt));
            else longtermInterest = 0;
            
            if(!$A.util.isUndefinedOrNull(shortTermYearlyInterest[currentDebtsAnalysisYear-offset]))
                shorttermInterest = (parseFloat(shortTermYearlyInterest[currentDebtsAnalysisYear-offset]));
            else shorttermInterest = 0;
            
            if(isNaN(longtermInterest)){
                longtermInterest = 0;
            }
            if(isNaN(shorttermInterest)) {
                shorttermInterest = 0;
            }
            component.set("v.longTermLoans", Math.round(longtermInterest));
            component.set("v.shortTermLoans", Math.round(shorttermInterest));
            
            data = component.get("v.data");
            if($A.util.isUndefinedOrNull(data) != true) {
                offset = data.offset;
                
                for(var i=startYear; i<data.debtAnalysis.yearlyData.length; i++) {
                    
                    shortTermYearlyInterest[i] = data.debtAnalysis.yearlyData[i].interestOnDebt;    
                    tempArray = data.debtAnalysis.yearlyData[i].monthlyDebts[(data.debtAnalysis.yearlyData[i].monthlyDebts.length - 1)];
                    for(var j=0; j<tempArray.length; j++) {
                        for(var k=0; k<dataSeriesDebt.length; k++) { 
                            if(tempArray[j].name == dataSeriesDebt[k].label && (selected == 'All' || selected == dataSeriesDebt[k].label)){
                                if(tempArray[j].item.termDebt && tempArray[j].item.defaultedItem != undefined && tempArray[j].item.defaultedItem != null){
                                    dataSeriesDebt[k].data.push([(offset+i), (tempArray[j].item.currentValue+tempArray[j].item.defaultedItem.currentValue)]);
                                    flag = false;
                                    endYear = i;
                                    break;
                                } else {
                                    dataSeriesDebt[k].data.push([(offset+i), tempArray[j].item.currentValue]);
                                    flag = false;
                                    endYear = i;
                                    break;
                                }
                            }
                        }
                        if(flag) {
                            if (typeof(debtList2[tempArray[j].name]) == 'undefined') {
                                debtList.push({count: 1, name:tempArray[j].name});
                                debtList2[tempArray[j].name] = 1;
                            }
                            if(selected == 'All' || selected == tempArray[j].name) {
                                d1 = new Array();
                                if(tempArray[j].item.termDebt && tempArray[j].item.defaultedItem != undefined && tempArray[j].item.defaultedItem != null){
                                    d1.push([(offset+i), (tempArray[j].item.currentValue+tempArray[j].item.defaultedItem.currentValue)]);
                                } else {
                                    d1.push([(offset+i), tempArray[j].item.currentValue]);
                                }
                                dataSeriesDebt.push({data: d1, bars: {barWidth: 0.3, align:"center", show:true}, stack:true, shadowSize: 0, label: tempArray[j].name});
                                endYear = i;
                            }
                        }
                        flag = true;  
                    }
                }
                
                
                component.set("v.shortTermYearlyInterest", shortTermYearlyInterest);
                
                //make chart Label and set points
                if($A.util.isUndefinedOrNull(dataSeriesDebt[0]) != true) {
                    for(var i = 0; i<dataSeriesDebt[0].data.length; i++)
                    {
                        chartLabels[i] = dataSeriesDebt[0]["data"][i][0];
                        chartDataSet[i] = dataSeriesDebt[0]["data"][i][1];
                    }
                }
                //Chart plotting Starts here
                var chartdata = component.get("v.chartDataObject");
                if(chartdata) {
                    chartData.destroy();
                }
                chartdata = {
                    labels: chartLabels,
                    datasets: [
                        {
                            label:'Debt Forecast',
                            data: chartDataSet,
                            backgroundColor:'rgba(0, 0, 255, 0.3)'
                        }
                    ]
                }
                
                var ctx = component.find("debtForecastGraph").getElement();
                var lineChart = new Chart(ctx ,{
                    type: 'bar',
                    data: chartdata,
                    options: {	
                        
                        //format y axis
                        scales: { 
                            yAxes: [{
                                ticks: {
                                    suggestedMin: 0,    
                                    beginAtZero: true,
                                    callback: function(label, index, labels) {
                                        return Intl.NumberFormat('Yo', { 
                                            style: 'currency', currency: 'USD', minimumFractionDigits: 0, 
                                        }).format(label);
                                    }
                                }
                            }]
                        },
                        
                        legend: {
                            position: 'bottom',
                            padding: 1,
                        },
                        responsive: true
                    }
                });   
            }
            var c = component.get('c.showDebtAnalysis');
            $A.enqueueAction(c);
        }//end try
        catch(e){
            console.log('Exception here in debt anlysis. Message: ' + e.message);
        }
    },
    
    prevYearlyInterest : function(component) {
        var data = component.get("v.data");
        var offset = data.offset;
        var shortTermYearlyInterest = component.get("v.shortTermYearlyInterest");
        var currentDebtsAnalysisYear = component.get("v.year");
        
        var decide = 'prev';
        var currentDebtsAnalysisYear;
        var debtsAnalysisYear;
        var longtermInterest;
        var shorttermInterest;
        
        //parse interest rates if previous year
        if(decide=='prev') {
            currentDebtsAnalysisYear--;
            if(currentDebtsAnalysisYear>=offset) {
                debtsAnalysisYear = (currentDebtsAnalysisYear);
                longtermInterest = (parseFloat(data.debtAnalysis.yearlyData[currentDebtsAnalysisYear-offset].interestOnTermDebt));
                shorttermInterest = (parseFloat(shortTermYearlyInterest[currentDebtsAnalysisYear-offset]));
                component.set("v.year", currentDebtsAnalysisYear);
            } else {
                var event = $A.get("e.force:showToast");
                event.setParams({ "type" : "Error", "title" : "Info !", "message" : "Sorry can not display year data." });
                event.fire();
                currentDebtsAnalysisYear++;
                longtermInterest = component.get("v.longTermLoans");
                shorttermInterest = component.get("v.shortTermLoans");
            }   
        }
        
        component.set("v.longTermLoans", Math.round(longtermInterest));
        component.set("v.shortTermLoans",Math.round(shorttermInterest));
    },
    
    nextYearlyInterest : function(component) {
        var shortTermYearlyInterest = component.get("v.shortTermYearlyInterest");   
        var currentDebtsAnalysisYear = component.get("v.year");
        var data = component.get("v.data");
        var offset = data.offset;        
        var decide = 'next';
        
        var currentDebtsAnalysisYear;        
        var debtsAnalysisYear;
        var longtermInterest;
        var shorttermInterest;      
        
        if(decide=='next') {
            currentDebtsAnalysisYear++;
            if(currentDebtsAnalysisYear<=(offset+9)) {
                debtsAnalysisYear = currentDebtsAnalysisYear;
                longtermInterest = (parseFloat(data.debtAnalysis.yearlyData[currentDebtsAnalysisYear-offset].interestOnTermDebt));
                shorttermInterest = (parseFloat(shortTermYearlyInterest[currentDebtsAnalysisYear-offset]));
                component.set("v.year", currentDebtsAnalysisYear);
            } else {
                var event = $A.get("e.force:showToast");
                event.setParams({ "type" : "Error", "title" : "Info !", "message" : "Sorry can not display year data." });
                event.fire();
                currentDebtsAnalysisYear--;
                longtermInterest = component.get("v.longTermLoans");
                shorttermInterest = component.get("v.shortTermLoans");
            }
        }
        
        component.set("v.longTermLoans", Math.round(longtermInterest));
        component.set("v.shortTermLoans", Math.round(shorttermInterest));
    },
    
    debtAnalysis : function(component) {
        
        var data = component.get("v.data");
        var element = data.debtAnalysis;
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
    
    showDefaultAlertTable:function(component,event){
        var data = component.get("v.data");
      ///  console.log(data.debtAnalysis);
        var offset=data.offset;
        var termD=event.target.name;
        var debtData = new Array();
        var paymentOwed, difference;
        var item;
        for(var i=0; i<data.debtAnalysis.yearlyData.length; i++){
            paymentOwed = 0;
            difference = 0;
            
            for(var j=0; j<data.debtAnalysis.yearlyData[i].monthlyDebts.length; j++){
                for(var k=0; k<data.debtAnalysis.yearlyData[i].monthlyDebts[j].length; k++){
                    item = data.debtAnalysis.yearlyData[i].monthlyDebts[j][k];
                   // console.log(item.item.termDebt.toString(), termD)
                    if(item.item.termDebt.toString()== termD){
                        if(item.item.termDebt){
                            paymentOwed += item.item.paymentDue;
                            difference += item.item.difference; 
                        } else {
                            paymentOwed += item.item.paymentDue;
                            difference += item.item.difference;
                            console.log(difference)
                        }
                    }
                }
            }
            if(item.item.termDebt){
                // console.log(item.item.difference)
            }
            if(difference > 0){
              
                debtData.push({scale:(offset+i), owed: paymentOwed.toFixed(2), possible: (paymentOwed-difference).toFixed(2)});
            }
        }
        if(debtData.length > 0){
            component.set('v.defaultAlertData',debtData);
            
        }
    },
    
    showInterestAlertTable: function(component, event){
        
        var diagnosis = component.get("v.data");
        //console.log(diagnosis.debtAnalysis);
        var offset=diagnosis.offset;
        var termD=event.target.name;
        var data = new Array();
        var interest = 0;
        for(var i=0; i<diagnosis.debtAnalysis.yearlyData.length; i++){
            interest = parseFloat(diagnosis.debtAnalysis.yearlyData[i].interestOnDebt);
            if(interest > 0){
                data.push({scale:(offset+i), charge: interest.toFixed(2)});
            }
        }
        if(data.length > 0){
            component.set('v.interestAlertData',data);
        }
    }
})