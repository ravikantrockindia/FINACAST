@isTest
global class MockHttpResponseGenerator implements HttpCalloutMock {
    // Implement this interface method
    global HTTPResponse respond(HTTPRequest req) {
        // Optionally, only send a mock response for a specific endpoint
        // and method.
        System.assertEquals('https://api.worldtradingdata.com/api/v1/stock?symbol=^INX,^DJI,^IXIC,^NYA&api_token=W3WHMBuNhqeVx5ZIMC5d5xr5nGDDxON2ubfjv5LwzLACjt92xz2m99pRVXGN', req.getEndpoint());
        System.assertEquals('GET', req.getMethod());
        
        // Create a fake response
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"example":"test"}');
        res.setStatusCode(200);
        return res;
    }
}