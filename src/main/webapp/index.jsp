<%@ page pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="pdt" uri="WEB-INF/tlds/PoolStorage.tld" %>

<%-- If the language is being passed in a parameter, use that language. --%>
<c:if test="${not empty param.language}">
    <c:set var="language" value="${param.language}" scope="session" />
</c:if>
<%-- If the language variable isn't set at all, use the default locale from the request. --%> 
<c:if test="${empty language}">
    <c:set var="language" value="${pageContext.request.locale}" scope="session" />
</c:if>

<%-- Use the locale to set up the bundle. --%>
<fmt:setLocale value="${language}" />
<fmt:setBundle basename="net.leejjon.blindpool.i18n.messages" />

<!DOCTYPE html>
<html lang="${language}">
    <head>
        <title><fmt:message key="title" /></title>
    </head>
    <body>
        <div id="languageField" align="center">
            <form>
                <label><fmt:message key="language" /></label>
                <select id="language" name="language" onchange="submit()">
                    <option value="en" ${language == 'en' ? 'selected' : ''}>English</option>
                    <option value="nl" ${language == 'nl' ? 'selected' : ''}>Nederlands</option>
                </select>
            </form>
            <p>
                <%-- Took me ages to figure out how to use parameters. --%>
                <fmt:message key="number.of.pools">
                    <fmt:param value="${pdt:getPoolCount()}"/>
                </fmt:message>
            </p>
        </div>
    </body>
</html>
