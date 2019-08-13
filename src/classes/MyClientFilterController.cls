public class MyClientFilterController {

    public static String sObjectName;
    public static Map<String, String> fieldsToExcludeMap;
    public static String namespace ;
    
    // method to fetch the namespace
    @AuraEnabled
    public static void getNamespace(){
        List<UserPrefr__c> gn = [Select Id, Namespace__c 
                                 FROM UserPrefr__c 
                                 WHERE Namespace__c != null and createdById=:UserInfo.getUserId()];
        
        if(gn!=null && gn.size()>0) {
            if(String.isEmpty(gn[0].Namespace__c)){
                namespace = '';
            }
            else{
                namespace = gn[0].Namespace__c + '__';
            }
        }
        else{
            namespace = '';
        }
        
    }
    
    @AuraEnabled
    public static Data_Wrapper getObjectFieldsApex(String objectName){
        
        getNamespace();
        setExcludedFields(objectName);
        Map <String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType ObjectSchema = schemaMap.get(objectName);
        Map<String, Schema.SObjectField> fieldMap = ObjectSchema.getDescribe().fields.getMap();
        List<FieldWrapper> fieldList = new List<FieldWrapper>();
        List<String> fieldLabels = new List<String>();
        
        for (String fieldName: fieldMap.keySet()){
            if(checkValidityForFilter(fieldMap.get(fieldName).getDescribe())){
                String dType, label, apiName;
                List<PickListValueWrapper> pkValList;
                dType = String.valueOf(fieldMap.get(fieldName).getDescribe().getType());
                label = fieldMap.get(fieldName).getDescribe().getLabel();
                apiName = fieldMap.get(fieldName).getDescribe().getName();
                //System.debug(fieldMap.get(fieldName).getDescribe().getLabel() + ' : ' + fieldMap.get(fieldName).getDescribe().getName() + ' : ' + fieldMap.get(fieldName).getDescribe().getType());
                if(fieldMap.get(fieldName).getDescribe().getType() == Schema.DisplayType.REFERENCE){
                    if(apiName.equalsIgnoreCase('CreatedById') || apiName.equalsIgnoreCase('OwnerId')
                       || apiName.equalsIgnoreCase('LastModifiedById')){
                           dType = 'STRING';
                           label = label.replace('ID', 'Alias');
                           apiName = apiName.replace('Id', '.Name');
                       }
                    //Aditya update---->
                    else{
                        dType = 'STRING';
                        label = label.replace('ID', 'Name');
                        apiName = apiName.replace('Id', '.Name'); 
                    }
                }
                if(fieldMap.get(fieldName).getDescribe().getType() == Schema.DisplayType.PICKLIST){
                    pkValList = new List<PickListValueWrapper>();
                    for(PickListEntry pk : fieldMap.get(fieldName).getDescribe().getPickListValues()){
                        pkValList.add(new PickListValueWrapper(pk.getLabel(), pk.getValue()));
                    }
                    fieldList.add(new FieldWrapper(label, apiName, dType, pkValList));
                }
                else{
                    fieldList.add(new FieldWrapper(label, apiName, dType));
                }
            }
        }
        
        
        //Add Owner First Name and Owner Last Name to the fieldList
        fieldList.add(new FieldWrapper('Owner First Name', 'Owner.FirstName', 'STRING'));
        fieldList.add(new FieldWrapper('Owner Last Name', 'Owner.LastName', 'STRING'));
        fieldList.sort();
        Data_Wrapper d = new Data_Wrapper(fieldList, namespace);
        return d;        
    }
    
   /*  @AuraEnabled
    public static Map<String,List<FilterInformation>> fetchExistingFiltersApex(String listId){
        
            Map<String,List<FilterInformation>> filterMap = new Map<String,List<FilterInformation>>();
            List<FilterInformation> filters = new List<FilterInformation>();
            String key='NA';
           for(DialPad_List_Filter__c filterEntry : [SELECT id, Field_Name__c, Field_Value__c, Field_Data_Type__c,
                                                      Filter_Index__c, Operator__c, DialPad_List__r.Filter_Logic__c
                                                      FROM DialPad_List_Filter__c 
                                                      WHERE Dialpad_List__c = :listId
                                                      ORDER BY Filter_Index__c ASC]){
                                                          FilterInformation f = new FilterInforma0tion();
                                                          f.id = filterEntry.id;
                                                          f.index = String.valueOf(filterEntry.Filter_Index__c);
                                                          f.field = filterEntry.Field_Name__c;
                                                          f.operator = filterEntry.Operator__c;
                                                          f.value = filterEntry.Field_Value__c;
                                                          f.dataType = filterEntry.Field_Data_Type__c;
                                                          filters.add(f);
                                                          if(!String.isEmpty(filterEntry.Dialpad_List__r.Filter_Logic__c)){
                                                              key = filterEntry.Dialpad_List__r.Filter_Logic__c;
                                                          }
                                                      }
            filterMap.put(key,filters);
            
            return filterMap;
       
    }*/
    
    public static Boolean checkValidityForFilter(Schema.DescribeFieldResult field){
        
        if(!field.isAccessible() ){
            return false;
        }
        if(field.getType() == Schema.DisplayType.REFERENCE){
            if(!field.getReferenceTo()[0].getDescribe().fields.getMap().containsKey('Name')){
                return false;
            }
        }
        if(fieldsToExcludeMap.containsKey(field.getName())){
            return false;
        }
        if(field.getType() == Schema.DisplayType.ADDRESS || field.getType() == Schema.DisplayType.ID){
            return false;
        }
        else if (field.getType() == Schema.DisplayType.TEXTAREA) {
            if (field.getLength() <= 255 && !field.isHtmlFormatted()) {
                return true;
            } else if ((field.getLength() >= 256 && field.getLength() <= 131072) && !field.isHtmlFormatted()) {
                return false;
            } else if ((field.getLength() >= 256 && field.getLength() <= 131072) && field.isHtmlFormatted()) {
                return false;
            }
        }
        return true;
        
    }
    
 
    
   /* @AuraEnabled
    public static Integer getUserTimeZoneOffsetApex(String value){
        
        TimeZone tz = UserInfo.getTimeZone();
        String[] dateParts = value.split('/');
        Integer offset = tz.getOffset(DateTime.newInstance(Integer.valueOf(dateParts[2]), Integer.valueOf(dateParts[0]), Integer.valueOf(dateParts[1])));
        return offset;
        
    }*/
    
    public static void setExcludedFields(String objectName){
     
        if(objectName == 'Account'){
            fieldsToExcludeMap = new Map<String,String>{
                'BillingLatitude' => 'BillingLatitude',
                    'BillingLongitude' => 'BillingLongitude',
                    'BillingGeocodeAccuracy' => 'BillingGeocodeAccuracy',
                    'ShippingLatitude' => 'ShippingLatitude',
                    'ShippingLongitude' => 'ShippingLongitude',
                    'ShippingGeocodeAccuracy' => 'ShippingGeocodeAccuracy',
                    'JigsawCompanyId' => 'JigsawCompanyId',
                    'ConnectionReceivedId' => 'ConnectionReceivedId',
                    'ConnectionSentId' => 'ConnectionSentId'
                    };
                        }
           
           
           /* else{
                fieldsToExcludeMap = new Map<String,String>{
                    namespace + 'Filter_Logic__c' => namespace + 'Filter_Logic__c',
                    namespace + 'Column_List__c' => namespace + 'Column_List__c',
                    namespace + 'DialpadSaveOrder__c' => namespace + 'DialpadSaveOrder__c',
                    namespace + 'DialpadsortingField__c' => namespace + 'DialpadsortingField__c',
                    namespace + 'Where_Clause__c' => namespace + 'Where_Clause__c',
                    namespace + 'Order_By_Clause__c' => namespace + 'Order_By_Clause__c',
                        'ConnectionReceivedId' => 'ConnectionReceivedId',
                        'ConnectionSentId' => 'ConnectionSentId'
                        };
                            }*/
            //add common fields to exclude
        fieldsToExcludeMap.put('MasterRecordId','MasterRecordId');
        fieldsToExcludeMap.put('PhotoUrl','PhotoUrl');
        fieldsToExcludeMap.put('Jigsaw','Jigsaw');
        fieldsToExcludeMap.put('SystemModstamp','SystemModstamp');
        fieldsToExcludeMap.put('LastViewedDate','LastViewedDate');
        fieldsToExcludeMap.put('LastReferencedDate','LastReferencedDate');
        fieldsToExcludeMap.put('LastTransferDate','LastTransferDate');
        fieldsToExcludeMap.put('IsDeleted','IsDeleted');
        
    }
    
    /*public class MasterWrapper{
        @AuraEnabled public Double timeZoneOffset;
        @AuraEnabled public List<FieldWrapper> fields;
        
        public MasterWrapper(Double timeZoneOffset, List<FieldWrapper> fields){
            this.timeZoneOffset = timeZoneOffset;
            this.fields = fields.clone();
        }
    }*/
    
    public class Data_Wrapper {
        @AuraEnabled public List<FieldWrapper> fieldData;
        @AuraEnabled public String namespace;
        
        public Data_Wrapper(List<FieldWrapper> li, String n){
            fieldData = li.clone();
            namespace = n;
        }
    }
    public class FieldWrapper implements Comparable{
       
        @AuraEnabled public String label;
        @AuraEnabled public String apiName;
        @AuraEnabled public String dType;
        @AuraEnabled public List<PickListValueWrapper> pkValList;
        
        public FieldWrapper(String label, String apiName, String dType, List<PickListValueWrapper> pkValList){
            this.label = label;
            this.apiName = apiName;
            this.dType = dType;
            this.pkValList = pkValList.clone();
        }
        
        public FieldWrapper(String label, String apiName, String dType){
            this.label = label;
            this.apiName = apiName;
            this.dType = dType;
        }
        
        public Integer compareTo(Object compareTo){
            FieldWrapper fWrap = (FieldWrapper)compareTo;
            Integer compareResult = label.compareTo(fWrap.label);
            if(compareResult == 0){ //instance and objectToCompareTo are equal
                return 0;
            }
            if(compareResult > 0){ //instance is greater than objectToCompareTo
                return 1;
            }
            return -1; //instance is less than objectToCompareTo
        }
    }
    
    public class PickListValueWrapper{
        @AuraEnabled public String label;
        @AuraEnabled public String value;
        
        public PickListValueWrapper(String label, String value){
            this.label = label;
            this.value = value;
        }
    }
    
    /**********************************Deserialization Wrappers************************/
    public class FilterRoot{
        public List<FilterInformation> filterList;
    }
    
    public class FilterInformation{
        @AuraEnabled public String id;
        @AuraEnabled public String index;
        @AuraEnabled public String field;
        @AuraEnabled public String operator;
        @AuraEnabled public String value;
        @AuraEnabled public String dataType;
    }
    
    @AuraEnabled
    public static Data_Wrapper getGenuineObjectFieldsApex(String objectName){
     
            getNamespace();
            setExcludedFields(objectName);
            Map <String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
            Schema.SObjectType ObjectSchema = schemaMap.get(objectName);
            Map<String, Schema.SObjectField> fieldMap = ObjectSchema.getDescribe().fields.getMap();
            List<FieldWrapper> fieldList = new List<FieldWrapper>();
            List<String> fieldLabels = new List<String>();
            
            for (String fieldName: fieldMap.keySet()){
                if(checkValidityForFilter(fieldMap.get(fieldName).getDescribe())){
                    
                    String dType, label, apiName;
                    List<PickListValueWrapper> pkValList;
                    dType = String.valueOf(fieldMap.get(fieldName).getDescribe().getType());
                    label = fieldMap.get(fieldName).getDescribe().getLabel();
                    apiName = fieldMap.get(fieldName).getDescribe().getName();
                    
					//for reference types
                    if(fieldMap.get(fieldName).getDescribe().getType() == Schema.DisplayType.REFERENCE){
                        if(apiName.equalsIgnoreCase('CreatedById') || apiName.equalsIgnoreCase('OwnerId')
                           || apiName.equalsIgnoreCase('LastModifiedById')){
                               dType = 'REFERENCE';
                               label = label.replace('ID', 'Alias');
                               apiName = apiName.replace('Id', '.Name');
                           }
                        //Aditya update---->
                        else{
                           dType = 'REFERENCE';
                               label = label.replace('ID', 'Name');
                               apiName = apiName.replace('Id', '.Name'); 
                        }
                    }
                    
                    //for picklistValues
                    if(fieldMap.get(fieldName).getDescribe().getType() == Schema.DisplayType.PICKLIST){
                        pkValList = new List<PickListValueWrapper>();
                        for(PickListEntry pk : fieldMap.get(fieldName).getDescribe().getPickListValues()){
                            pkValList.add(new PickListValueWrapper(pk.getLabel(), pk.getValue()));
                        }
                        fieldList.add(new FieldWrapper(label, apiName, dType, pkValList));
                    }
                    
                    //for other types
                    else{
                        fieldList.add(new FieldWrapper(label, apiName, dType));
                    }
                }
            }
            
            //Add Owner First Name and Owner Last Name to the fieldList
            fieldList.add(new FieldWrapper('Owner First Name', 'Owner.FirstName', 'STRING'));
            fieldList.add(new FieldWrapper('Owner Last Name', 'Owner.LastName', 'STRING'));
            fieldList.sort();
            //Timezone
            //MasterWrapper m = new MasterWrapper(fieldList);
            Data_Wrapper d = new Data_Wrapper(fieldList, namespace);
            return d;
        
       
    }//method End

    

}