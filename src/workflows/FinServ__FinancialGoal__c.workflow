<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <fieldUpdates>
        <fullName>Action_to_update_Start_Date</fullName>
        <field>Start_Date__c</field>
        <formula>TODAY()</formula>
        <name>Action to update Start Date</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>Update the Start Date to today</fullName>
        <actions>
            <name>Action_to_update_Start_Date</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>FinServ__FinancialGoal__c.Start_Date__c</field>
            <operation>equals</operation>
        </criteriaItems>
        <triggerType>onCreateOnly</triggerType>
    </rules>
</Workflow>
