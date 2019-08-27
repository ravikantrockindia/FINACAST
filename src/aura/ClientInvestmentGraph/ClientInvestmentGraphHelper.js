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
                
                
                if(sumAlt < 9999) {
                    component.set("v.sumAlt2",sumStocks);
                }                
                else if(sumAlt < 1000000) {
                    component.set("v.sumAlt2",Math.round(sumOther/1000) + "K"); 
                }
                    else if( sumAlt < 10000000) {
                        component.set("v.sumAlt2",(sumOther/1000000).toFixed(2) + "M");
                    }                
                        else  if(sumAlt < 1000000000) {
                            component.set("v.sumAlt2",Math.round((sumAlt/1000000)) + "M");
                        }                
                            else if(sumAlt < 1000000000000) {
                                component.set("v.sumAlt2",Math.round((sumAlt/1000000000)) + "B");
                            }
                
                
                
                if(sumOther < 9999) {
                    component.set("v.sumOther2",sumStocks);
                }                
                else if(sumOther < 1000000) {
                    component.set("v.sumOther2",Math.round(sumOther/1000) + "K"); 
                }
                    else if( sumOther < 10000000) {
                        component.set("v.sumOther2",(sumOther/1000000).toFixed(2) + "M");
                    }                
                        else  if(sumOther < 1000000000) {
                            component.set("v.sumOther2",Math.round((sumOther/1000000)) + "M");
                        }                
                            else if(sumOther < 1000000000000) {
                                component.set("v.sumStocks2",Math.round((sumOther/1000000000)) + "B");
                            }
                
                
                
                if(sumStocks < 9999) {
                    component.set("v.sumStocks2",sumStocks);
                }                
                else if(sumStocks < 1000000) {
                    component.set("v.sumStocks2",Math.round(sumStocks/1000) + "K"); 
                }
                    else if( sumStocks < 10000000) {
                        component.set("v.sumStocks2",(sumStocks/1000000).toFixed(2) + "M");
                    }                
                        else  if(sumStocks < 1000000000) {
                            component.set("v.sumStocks2",Math.round((sumStocks/1000000)) + "M");
                        }                
                            else if(sumStocks < 1000000000000) {
                                component.set("v.sumStocks2",Math.round((sumStocks/1000000000)) + "B");
                            }
                
                
                
                if(sumBonds < 9999) {
                    component.set("v.sumBonds2",sumBonds);
                }                
                else if(sumBonds < 1000000) {
                    component.set("v.sumBonds2",Math.round(sumBonds/1000) + "K"); 
                }
                    else if( sumBonds < 10000000) {
                        component.set("v.sumBonds2",(sumBonds/1000000).toFixed(2) + "M");
                    }                
                        else  if(sumBonds < 1000000000) {
                            component.set("v.sumBonds2",Math.round((sumBonds/1000000)) + "M");
                        }                
                            else if(sumBonds < 1000000000000) {
                                component.set("v.sumBonds2",Math.round((sumBonds/1000000000)) + "B");
                            }
                
                
                
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
                //  var sumcashvalue =component.get("v.sumCash");
                //  component.set("v.sumCash2",+sumcashvalue);
                if(sumCash < 9999) {
                    component.set("v.sumCash2",sumCash);
                    
                }                
                else if(sumCash < 1000000) {
                    component.set("v.sumCash2",Math.round(sumCash/1000) + "K"); 
                }
                    else if( sumCash < 10000000) {
                        component.set("v.sumCash2",(sumCash/1000000).toFixed(2) + "M");
                    }                
                        else  if(sumCash < 1000000000) {
                            component.set("v.sumCash2",Math.round((sumCash/1000000)) + "M");
                        }                
                            else if(sumCash < 1000000000000) {
                                component.set("v.sumCash2",Math.round((sumCash/1000000000)) + "B");
                            }
                
                helper.donutchart(component,event,helper);
                helper.GetvalueAmount(component,event,helper);
            }            
        });        
        $A.enqueueAction(action);  
        
        
    },
    
    GetvalueAmount  : function(component,event,helper) {
        var res = component.get("v.Amount");
        
        var evt = $A.get("e.c:amountpass");
        evt.setParams({ "Amtval": res});
        evt.fire(); 
    },
    
    donutchart : function(component,event,helper) {
        var chart = new CanvasJS.Chart("CanvasContainer", {
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
                type: "doughnut",
                startAngle: 45,
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
                toolTipContent: "<b>{label}:</b> {markerType} (#percent%)",
                dataPoints: [
                    { y: component.get("v.sumCash"), label: "Cash", name:"Cash",markerType:component.get("v.sumCash2")},
                    { y: component.get("v.sumBonds"), label: "Bonds", name:"Bonds" ,markerType:component.get("v.sumBonds2")},
                    { y: component.get("v.sumStocks"), label: "Stocks" ,name:"Stocks",markerType:component.get("v.sumStocks2")},
                    { y: component.get("v.sumOther") , label: "Others", name:"Others",markerType:component.get("v.sumOther2")},
                    { y: component.get("v.sumAlt") , label: "Miscellaneous", name:"Miscellaneous",markerType:component.get("v.sumAlt2")}
                    
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