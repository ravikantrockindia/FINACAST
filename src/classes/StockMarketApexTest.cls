@isTest
private class StockMarketApexTest {
     @isTest static void testCallout() {
        // Set mock callout class 
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        
        // Call method to test.
        // This causes a fake response to be sent
        // from the class that implements HttpCalloutMock. 
        Map<String,Object> res=new Map<String,Object>(StockMarketApex.getCalloutResponseContents('https://api.worldtradingdata.com/api/v1/stock?symbol=^INX,^DJI,^IXIC,^NYA&api_token=W3WHMBuNhqeVx5ZIMC5d5xr5nGDDxON2ubfjv5LwzLACjt92xz2m99pRVXGN'));
        // System.debug('mapofres '+mapofres);
      /*  httpResponse res=new httpresponse();
         res=JSON.serialize(mapofres);
        */    
        
        // Verify response received contains fake values
      /*  String contentType = res.getHeader('Content-Type');
        System.assert(contentType == 'application/json');
        String actualValue = res.getBody();
        String expectedValue = '{"example":"test"}';
        System.assertEquals(actualValue, expectedValue);
        System.assertEquals(200, res.getStatusCode());*/
    }
}