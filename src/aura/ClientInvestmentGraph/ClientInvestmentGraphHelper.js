({	
    doInit:function(component, event, helper){
        var action=component.get('c.GetData');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS"){               
                component.set("v.Data",response.getReturnValue());
                var DataList = component.get("v.Data");
                 
                
                var sum=0; 
                var sumBonds=0;
                var sumStocks=0;
                var sumOther=0;
                var sumCash=0;
                var sumAlt=0;
                
                for (var i = 0; i < DataList.length; i++) { 
                    sum += DataList[i].FinServ__Amount__c;
                    if(DataList[i].FinServ__AssetsAndLiabilitiesType__c=='Bonds'){
                        sumBonds+=DataList[i].FinServ__Amount__c;
                    }
                    else if(DataList[i].FinServ__AssetsAndLiabilitiesType__c=='Cash' || DataList[i].FinServ__AssetsAndLiabilitiesType__c=='Gold' ){
                        sumCash+=DataList[i].FinServ__Amount__c;
                    }
                    else if(DataList[i].FinServ__AssetsAndLiabilitiesType__c=='Stocks'){
                        sumStocks+=DataList[i].FinServ__Amount__c;
                    }
                    else if(DataList[i].FinServ__AssetsAndLiabilitiesType__c=='Other'){
                        sumOther+=DataList[i].FinServ__Amount__c;
                    }
                        else{
                            sumAlt+=DataList[i].FinServ__Amount__c;
                        }
                    
                    
                }
                component.set("v.sumCash",sumCash);
                component.set("v.sumBonds",sumBonds);
                component.set("v.sumStocks",sumStocks);
                component.set("v.sumOther",sumOther);
                component.set("v.sumAlt",sumAlt);
                 				         
                if(sum < 9999) {
                    component.set("v.Amount",sum);
                }                
                else if(sum < 1000000) {
                    component.set("v.Amount",Math.round(sum/1000) + "K"); 
                }
                    else if( sum < 10000000) {
                        component.set("v.Amount",(sum/1000000).toFixed(2) + "M");
                    }                
                        else  if(sum < 1000000000) {
                            component.set("v.Amount",Math.round((sum/1000000)) + "M");
                        }                
                            else if(sum < 1000000000000) {
                                component.set("v.Amount",Math.round((sum/1000000000)) + "B");
                            }
                helper.donutchart(component,event,helper);
            }            
        });        
        $A.enqueueAction(action);          
    },
    donutchart : function(component,event,helper) {
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,  
            dataPointWidth: 35,
             
            legend:{
                fontFamily:50,             
                fontWeight:"bold",
                HorizontalAlign:"right",
                cursor: "pointer",
                itemclick: explodePie
            },
            toolTip: {
                 shared: true,
               
                },
            data: [{
                type:"doughnut",
              	startAngle: 0,
                showInLegend:true,
                innerRadius: 25,
                indexLabelFontSize: 10,
                indexLabelFontWeight:300,
         //       indexLabelOrientation: "vertical",
                
                indexLabelFontColor: "white",
                indexLabelFontStyle: "bold",
                indexLabelPlacement: "inside",
                indexLabel: "#percent%",
                percentFormatString: "#0.",
                toolTipContent: "<b>{label}:</b> {y} (#percent%)",
                dataPoints: [
                    { y: component.get("v.sumCash"), label: "Cash", name:"Cash" },
                    { y: component.get("v.sumBonds"), label: "Bonds", name:"Bonds" },
                    { y: component.get("v.sumStocks"), label: "Stocks" ,name:"Stocks"},
                    { y: component.get("v.sumOther") , label: "Others", name:"Others"},
                    { y: component.get("v.sumAlt") , label: "Miscellaneous", name:"Miscellaneous"}
                     
                        ]
                    }]
         
            });
                       
            chart.render(); 
        function explodePie (e) {
            if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
                e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
            } else {
                e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
            }
            e.chart.render();
		}
    }
})