({

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
                var moneyOwned = 0;
                var moneytobepaid = 0;
                var dataPoints1=new Array();
                console.log(dataSeriesDebt);
                if($A.util.isUndefinedOrNull(dataSeriesDebt[0]) != true) {
                    for(var i = 0; i<dataSeriesDebt.length; i++)
                    {
                                        var dataPoints=new Array();

                        //chartLabels[i] = dataSeriesDebt[i]["data"][i][0];
                       // chartDataSet[i] = dataSeriesDebt[i]["data"][i][1];
                        console.log(dataSeriesDebt[i])
                        moneyOwned += Math.floor(parseFloat(chartDataSet[i]));
                        moneytobepaid = Math.floor(parseFloat(chartDataSet[9]));
                        if(isNaN(moneytobepaid)){
                            moneytobepaid =0;
                        }
                        for(var j=0;j<dataSeriesDebt[i].data.length;j++){
                            dataPoints.push({x: new Date(dataSeriesDebt[i].data[j][0], 0) , y:dataSeriesDebt[i].data[j][1]});
                        }
                        
                        var d = { type: "stackedColumn", toolTipContent: " {label} $: {y}", showInLegend:true,name:dataSeriesDebt[i].label, label:dataSeriesDebt[i].label ,yValueFormatString: "#,##0,.##K",dataPoints:dataPoints };
                        dataPoints1.push(d);
                    }
                  
                }
               
                  if(moneyOwned < 999) {
                    component.set("v.moneyOwned",moneyOwned);
                }
               
                else if(moneyOwned < 1000000) {
                    component.set("v.moneyOwned",Math.round(moneyOwned/1000) + " K");
                }
                    else if( moneyOwned < 10000000) {
                        component.set("v.moneyOwned",(moneyOwned/1000000).toFixed(2) + " M");
                    }
               
                        else  if(moneyOwned < 1000000000) {
                            component.set("v.moneyOwned",Math.round((moneyOwned/1000000)) + " M");
                        }
               
                            else if(moneyOwned < 1000000000000) {
                                component.set("v.moneyOwned",Math.round((moneyOwned/1000000000)) + " B");
                            }            
              //  component.set("v.moneyOwned",moneyOwned.toLocaleString());    
                
                   if(moneytobepaid < 999) {
                    component.set("v.moneytobepaid",moneytobepaid);
                }
               
                else if(moneytobepaid < 1000000) {
                    component.set("v.moneytobepaid",Math.round(moneytobepaid/1000) + " K");
                }
                    else if( moneytobepaid < 10000000) {
                        component.set("v.moneytobepaid",(moneytobepaid/1000000).toFixed(2) + " M");
                    }
               
                        else  if(moneytobepaid < 1000000000) {
                            component.set("v.moneytobepaid",Math.round((moneytobepaid/1000000)) + " M");
                        }
               
                            else if(moneytobepaid < 1000000000000) {
                                component.set("v.moneytobepaid",Math.round((moneytobepaid/1000000000)) + " B");
                            } 
              //  component.set("v.moneytobepaid",moneytobepaid.toLocaleString());
                //Chart plotting Starts here
                var dps=new Array();
                for(var i=0; i<chartLabels.length; i++){
                    dps.push({x: new Date(chartLabels[i], 0) , y: chartDataSet[i]});
                }
                var chart = new CanvasJS.Chart("chartContainer3.29959", {
                   
                    animationEnabled: true,
                    title:{
                        //text: "Debt Forecast",
                        fontFamily: "arial black",
                        fontColor: "#695A42"
                    },
                    dataPointWidth: 35,
                    axisX: {
                        interval: 1,
                        intervalType: "year"
                    }, 
                     legend:{
                        cursor: "pointer",
                        itemclick: function (e) {
                            if(typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                                e.dataSeries.visible = false;
                            }
                            else {
                                e.dataSeries.visible = true;
                            }
                            chart.render();
                        }
                    },
                    axisY:{
                        //  valueFormatString:"#0K",
                        gridColor: "#ffffff",
                        tickColor: "#ffffff"
                    },
                    toolTip:{
                        
                        contentFormatter: function ( e ) {
                            var value = e.entries[0].dataPoint.y;
                            if(value < 999)
                                return Math.round(value)
                            if(value > 999)
                                return Math.abs(value) > 999 ? Math.sign(value)*((Math.round(value)/1000).toFixed(1)) + 'K' : Math.sign(value)*Math.abs(value) 
                                else if(value < 10000000)
                                    return Math.abs(value) > 999 ? Math.sign(value)*((Math.round(value)/10000000).toFixed(1)) + 'M' : Math.sign(value)*Math.abs(value)
                                    else if(value < 1000000000000)
                                        return Math.abs(value) > 999 ? Math.sign(value)*((Math.round(value)/1000000000000).toFixed(1)) + 'B' : Math.sign(value)*Math.abs(value)
                                        }  
                    },
                    data: dataPoints1 /* [{
                        yValueFormatString: "$ #,### ",
                        //xValueFormatString: "MM YYYY",
                        type: "stackedColumn",
                        dataPoints: dps
                    },
                             {        
                       type: "stackedColumn",
                       showInLegend: true,
                       name: "Credit Cards",
                       color: "#48bcc7",
                       dataPoints: [
                           { y: 6.82, x: new Date(2010,0) },
                           { y: 9.02, x: new Date(2011,0) },
                           { y: 11.80, x: new Date(2012,0) },
                           { y: 14.11, x: new Date(2013,0) },
                           { y: 15.96, x: new Date(2014,0) },
                           { y: 17.73, x: new Date(2015,0) },
                           { y: 21.5, x: new Date(2016,0) }
                       ]
                   },
                   {        
                       type: "stackedColumn",
                       showInLegend: true,
                       name: "Morgage Loans",
                       color: "#508553",
                       dataPoints: [
                           { y: 7.28, x: new Date(2010,0) },
                           { y: 9.72, x: new Date(2011,0) },
                           { y: 13.30, x: new Date(2012,0) },
                           { y: 18.9, x: new Date(2013,0) },
                           { y: 8.10, x: new Date(2014,0) },
                           { y: 18.68, x: new Date(2015,0) },
                           { y: 2.45, x: new Date(2016,0) }
                       ]
                   },
                   {        
                       type: "stackedColumn",
                       showInLegend: true,
                       name: "Medical Loans",
                       color: "#85d689",
                       dataPoints: [
                           { y: 8.44, x: new Date(2010,0) },
                           { y: 10.58, x: new Date(2011,0) },
                           { y: 14.41, x: new Date(2012,0) },
                           { y: 6.86, x: new Date(2013,0) },
                           { y: 17.64, x: new Date(2014,0) },
                           { y: 26.32, x: new Date(2015,0) },
                           { y: 6.06, x: new Date(2016,0) }
                       ]
                   },
                   {        
                       type: "stackedColumn",
                       showInLegend: true,
                       name: "Car Loans",
                       color: "#084d0b",
                       dataPoints: [
                           { y: 7.28, x: new Date(2010,0) },
                           { y: 9.72, x: new Date(2011,0) },
                           { y: 13.30, x: new Date(2012,0) },
                           { y: 14.9, x: new Date(2013,0) },
                           { y: 18.10, x: new Date(2014,0) },
                           { y: 18.68, x: new Date(2015,0) },
                           { y: 22.45, x: new Date(2016,0) }
                       ]
                   }
                  ]*/
                   });
                   chart.render();  
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
         helper.debtAnalysis(component);
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