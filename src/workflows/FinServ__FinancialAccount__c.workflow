<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <fieldUpdates>
        <fullName>APY_Default_Value</fullName>
        <description>Whenever the value of APY field is null ,make the default value equal to zero</description>
        <field>FinServ__APY__c</field>
        <formula>0</formula>
        <name>APY Default Value</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
        <reevaluateOnChange>true</reevaluateOnChange>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Finacast_Account_Max_Tax_benefit_default</fullName>
        <description>Finacast Account Max Tax benefit default Value</description>
        <field>Max_yearly_tax_deduction_allowed__c</field>
        <formula>0</formula>
        <name>Finacast_Account_Max_Tax_benefit_default</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
        <reevaluateOnChange>true</reevaluateOnChange>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Populate_date_opened_with_created_date</fullName>
        <field>FinServ__OpenDate__c</field>
        <formula>CreatedDate</formula>
        <name>Populate date opened with created date</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Update_Balance_to_0</fullName>
        <field>FinServ__Balance__c</field>
        <formula>0</formula>
        <name>Update Balance to 0</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>APY Default Value</fullName>
        <actions>
            <name>APY_Default_Value</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>FinServ__FinancialAccount__c.FinServ__APY__c</field>
            <operation>equals</operation>
        </criteriaItems>
        <description>Set to zero ,whenever the value of APY field is Null</description>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>Finacast_Utility_Max_Tax_benefit_default_Value</fullName>
        <actions>
            <name>Finacast_Account_Max_Tax_benefit_default</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>FinServ__FinancialAccount__c.Max_yearly_tax_deduction_allowed__c</field>
            <operation>equals</operation>
        </criteriaItems>
        <description>Finacast Utility Max Tax benefit default Value</description>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>Mark Balance as 0 if Kept Null</fullName>
        <actions>
            <name>Update_Balance_to_0</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>FinServ__FinancialAccount__c.FinServ__Balance__c</field>
            <operation>equals</operation>
        </criteriaItems>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>Populate date opened field</fullName>
        <actions>
            <name>Populate_date_opened_with_created_date</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>FinServ__FinancialAccount__c.FinServ__OpenDate__c</field>
            <operation>equals</operation>
        </criteriaItems>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
</Workflow>
