({	
    doInit:function(component, event, helper){
        debugger;
        var action=component.get('c.GetData');
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS"){               
                component.set("v.Data",response.getReturnValue());
                var DataList = component.get("v.Data");
                
                
                var sum=0; 
                var sumBonds=0;
                var sumLoan=0;
                var sumCash=0;
                for (var i = 0; i < DataList.length; i++) { 
                    if(DataList[i].FinServ__Amount__c!=null){
                    if(DataList[i].FinServ__AssetsAndLiabilitiesType__c=='Cash' || DataList[i].FinServ__AssetsAndLiabilitiesType__c=='Bonds' || DataList[i].FinServ__AssetsAndLiabilitiesType__c=='Auto Loan'){
                    	sum += DataList[i].FinServ__Amount__c;
                    if(DataList[i].FinServ__AssetsAndLiabilitiesType__c=='Bonds'){
                        sumBonds+=DataList[i].FinServ__Amount__c;
                    }
                    else if(DataList[i].FinServ__AssetsAndLiabilitiesType__c=='Cash'){
                        sumCash+=DataList[i].FinServ__Amount__c;
                    }
                        else if(DataList[i].FinServ__AssetsAndLiabilitiesType__c=='Auto Loan'){
                            sumLoan+=DataList[i].FinServ__Amount__c;
                        }
                           
                    }else{
                        
                    }
                   }
                }
               
                component.set("v.sumCash",sumCash);
                component.set("v.sumBonds",sumBonds);
                component.set("v.sumLoan",sumLoan);
 
                if(sumLoan < 9999) {
                    component.set("v.sumLoan2",sumLoan);
                }                
                else if(sumLoan < 1000000) {
                    component.set("v.sumLoan2",Math.round(sumLoan/1000) + "K"); 
                }
                    else if( sumLoan < 10000000) {
                        component.set("v.sumLoan2",(sumLoan/1000000).toFixed(2) + "M");
                    }                
                        else  if(sumLoan < 1000000000) {
                            component.set("v.sumLoan2",Math.round((sumLoan/1000000)) + "M");
                        }                
                            else if(sumLoan < 1000000000000) {
                                component.set("v.sumLoan2",Math.round((sumLoan/1000000000)) + "B");
                            }
                
                
                
            /*    if(sumOther < 9999) {
                    component.set("v.sumOther2",sumOther);
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
                */
                
                
         /*       if(sumStocks < 9999) {
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
                */
                
                
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
                            else if(sum < 10000000000) {
                                component.set("v.Amount", (sum/1000000000).toFixed(2) + " B");
                            }
                                else if(sum<1000000000000) {
                                    component.set("v.Amount",Math.round((sum/1000000000)) + " B"); 
                                }  
                                    else if(sum < 10000000000000) {
                                        component.set("v.Amount", (sum/1000000000000).toFixed(2) + " T");
                                    }
                                        else if(sum<1000000000000000) {
                                            component.set("v.Amount",Math.round((sum/1000000000000)) + " T"); 
                                        }   

                //
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
                
                indexLabelFontColor: "white",
                indexLabelFontStyle: "bold",
                indexLabelPlacement: "inside",
                indexLabel: "#percent%",
                percentFormatString: "#0.",
                toolTipContent: "<b>{label}:</b> {markerType} (#percent%)",
                dataPoints: [
                    { y: component.get("v.sumCash"), label: "Cash", name:"Cash",markerType:component.get("v.sumCash2")},
                    { y: component.get("v.sumBonds"), label: "Bonds", name:"Bonds" ,markerType:component.get("v.sumBonds2")},
                    { y: component.get("v.sumLoan") , label: "Loan", name:"Loan",markerType:component.get("v.sumLoan2")}
                    
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