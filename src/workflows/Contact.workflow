<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <fieldUpdates>
        <fullName>DOB_Default_Value</fullName>
        <description>DOB is set to default</description>
        <field>Birthdate</field>
        <formula>DATE(1970,01,01)</formula>
        <name>DOB Default Value</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>DOB default</fullName>
        <actions>
            <name>DOB_Default_Value</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Contact.Birthdate</field>
            <operation>equals</operation>
        </criteriaItems>
        <description>set default DOB ,if DOB field is Empty</description>
        <triggerType>onCreateOnly</triggerType>
    </rules>
</Workflow>
