public with sharing class StockMarketApex {
	@AuraEnabled
	public static Map < String,Object > getCalloutResponseContents(String url) {
 		Http h = new Http();
        HttpRequest req = new HttpRequest();
		req.setEndpoint(url);
		req.setMethod('GET');
 		HttpResponse res = h.send(req);
		Map < String,Object > resultsMap = (Map < String, Object > ) JSON.deserializeUntyped(res.getBody());
		 List<Object> firststock = (List<Object>)resultsMap.get('data');
        Object[] arystock = (Object[]) resultsMap.get('data');
     	return resultsMap;
	}
    

    }