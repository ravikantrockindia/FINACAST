@isTest
global class FutureSimulationMockHttpResponse implements HttpCalloutMock{
    
    global HTTPResponse respond(HTTPRequest req) {
        
        System.assertEquals('https://mytafi.herokuapp.com/rest/service/getFutureSimulationsNew', req.getEndpoint());
        System.assertEquals('POST', req.getMethod());
        
        // Create a fake response
        HttpResponse res = new HttpResponse();
        
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"example":"test"}');
            res.setStatusCode(200);
        
        
        return res;
    }
}