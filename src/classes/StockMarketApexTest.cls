@isTest
public with sharing class StockMarketApexTest {
      static testMethod void myTest() {
          
           StockMarketApex.getCalloutResponseContents('https://api.worldtradingdata.com/api/v1/stock?symbol=^INX,^DJI,^IXIC,^NYA&api_token=W3WHMBuNhqeVx5ZIMC5d5xr5nGDDxON2ubfjv5LwzLACjt92xz2m99pRVXGN' );
//req.setEndpoint = 'https://api.worldtradingdata.com/api/v1/stock?symbol=^INX,^DJI,^IXIC,^NYA&api_token=W3WHMBuNhqeVx5ZIMC5d5xr5nGDDxON2ubfjv5LwzLACjt92xz2m99pRVXGN';  //Request URL
      }
   



}