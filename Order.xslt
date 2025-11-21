<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes"/>
	<xsl:template name="replace" match="text()" mode="replace">
		<xsl:param name="str" select="."/>
		<xsl:param name="search-for" select="'&#xA;'"/>
		<xsl:param name="replace-with">
			<xsl:element name="BR"/>
			<xsl:text>
</xsl:text>
		</xsl:param>
		<xsl:choose>
			<xsl:when test="contains($str, $search-for)">
				<xsl:value-of select="substring-before($str, $search-for)"/>
				<xsl:copy-of select="$replace-with"/>
				<xsl:call-template name="replace">
					<xsl:with-param name="str" select="substring-after($str, $search-for)"/>
					<xsl:with-param name="search-for" select="$search-for"/>
					<xsl:with-param name="replace-with" select="$replace-with"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$str"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="convertdate" match="text()" mode="replace">
		<xsl:param name="str" select="."/>
		<xsl:if test="string-length($str)&gt;0">
			<xsl:copy-of select="substring($str, 9, 2)"/>
			<xsl:text>.</xsl:text>
			<xsl:copy-of select="substring($str, 6, 2)"/>
			<xsl:text>.</xsl:text>
			<xsl:copy-of select="substring($str, 1, 4)"/>
		</xsl:if>
	</xsl:template>
	<xsl:template name="getdisplayname">
		<xsl:param name="lastname" select="."/>
		<xsl:param name="firstname" select="."/>
		<xsl:param name="middlename" select="."/>
		<xsl:param name="displaystring" select="."/>
		<xsl:if test="string-length($displaystring)!=0">
			<xsl:value-of select="$displaystring"/>
		</xsl:if>
		<xsl:if test="string-length($displaystring)=0">
			<xsl:value-of select="$lastname"/>
			<xsl:if test="string-length($lastname)!=0">
				<xsl:text>
				</xsl:text>
			</xsl:if>
			<xsl:value-of select="$firstname"/>
			<xsl:if test="string-length($firstname)!=0">
				<xsl:text>
				</xsl:text>
			</xsl:if>
			<xsl:value-of select="$middlename"/>
		</xsl:if>
	</xsl:template>
	<xsl:template name="getemployeedisplayname">
		<xsl:param name="employeerow" select="."/>
		<xsl:call-template name="getdisplayname">
			<xsl:with-param name="lastname" select="$employeerow/@LastName"/>
			<xsl:with-param name="firstname" select="$employeerow/@FirstName"/>
			<xsl:with-param name="middlename" select="$employeerow/@MiddleName"/>
			<xsl:with-param name="displaystring" select="$employeerow/@DisplayString"/>
		</xsl:call-template>
	</xsl:template>
	<xsl:template name="printcategories">
		<xsl:param name="categorylistid" select="."/>
		<xsl:if test="$categorylistid">
			<xsl:variable name="categorylistcard" select="//CardCategoryList[@CardID=$categorylistid]"/>
			<xsl:for-each select="$categorylistcard/Categories/CategoriesRow">
				<xsl:if test="position() &gt; 1">
					<xsl:text>, </xsl:text>
				</xsl:if>
				<xsl:value-of select="@CategoryID_Name"/>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>
	<xsl:template match="/">
		<html>
			<head>
				<title>
					<xsl:variable name="numberid" select="//Order[1]/MainInfo/@Number"/>
					Заказ №<xsl:value-of select="//Order[1]/Numbers/NumbersRow[@RowID=$numberid]/@Number"/>
				</title>
				<style type="text/css">
					.fieldheader {
						font-weight: bold;
                                                padding-top: 15px;
					}
					td {
						vertical-align: top;
						text-align: left;
						font-weight: bold;
					}
					th {
						text-align: left;
						font-weight: normal;
					}
					table, th, td {
					  border: 1px solid;
					  padding: 3px;
					}
					body {
						font-size: 12px;
					}
					td.name {
						font-weight: bold;
						font-size: 14px;
					}
					.digest {
					    padding-top: 3px;
						padding-bottom: 3px;
					}
				</style>
			</head>
			<body>
				<div class="fieldheader">
					<xsl:variable name="numberid" select="//Order[1]/MainInfo/@Number"/>
					Заказ №<xsl:value-of select="//Order[1]/Numbers/NumbersRow[@RowID=$numberid]/@Number"/>
				</div>
				<div class="digest">
					<xsl:value-of select="//Order[1]/MainInfo/@Digest"/>
				</div>
				<table width="100%" border="1">
						<th>№</th>
						<th>Назание</th>
						<th>Размер</th>						
						<th>Пол</th>
						<th>Сезон</th>
						<th>Стиль</th>
						<th>Цвет</th>
						<th>Возраст</th>
						<th>Комментарий</th>
						<xsl:for-each select="//Order[1]/OrderItems/OrderItemsRow">
							<tr>
								<td>
									<xsl:value-of select="@Number"/>
								</td>
								<td class="name">
									<xsl:value-of select="@Name"/>
								</td>
								<td>
									<xsl:value-of select="@Size"/>
								</td>
								
								<td>
									<xsl:choose>
										<xsl:when test="@Sex = 0">Женское</xsl:when>
										<xsl:when test="@Sex = 1">Мужское</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Season = 0">Лето</xsl:when>
										<xsl:when test="@Season = 1">Демисезон</xsl:when>
										<xsl:when test="@Season = 2">Зима</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Style = 0">Неважно</xsl:when>
										<xsl:when test="@Style = 1">Деловой</xsl:when>
										<xsl:when test="@Style = 2">Спортивный</xsl:when>
										<xsl:when test="@Style = 3">Домашний</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Color = 0">Неважно</xsl:when>
										<xsl:when test="@Color = 1">Темный</xsl:when>
										<xsl:when test="@Color = 2">Светлый</xsl:when>
										<xsl:when test="@Color = 3">Неяркий</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Age = 1">Ребенок</xsl:when>
										<xsl:when test="@Age = 2">Средний</xsl:when>
										<xsl:when test="@Age = 3">Пенсионер</xsl:when>
										<xsl:when test="@Age = 0">Неважно</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:value-of select="@Details"/>
								</td>
							</tr>
						</xsl:for-each>
					</table>

<div class="fieldheader">
					<xsl:variable name="numberid" select="//Order[1]/MainInfo/@Number"/>
					Заказ №<xsl:value-of select="//Order[1]/Numbers/NumbersRow[@RowID=$numberid]/@Number"/>
				</div>
				<div class="digest">
					<xsl:value-of select="//Order[1]/MainInfo/@Digest"/>
				</div>
				<table width="100%" border="1">
						<th>№</th>
						<th>Назание</th>
						<th>Размер</th>						
						<th>Пол</th>
						<th>Сезон</th>
						<th>Стиль</th>
						<th>Цвет</th>
						<th>Возраст</th>
						<th>Комментарий</th>
						<xsl:for-each select="//Order[1]/OrderItems/OrderItemsRow">
							<tr>
								<td>
									<xsl:value-of select="@Number"/>
								</td>
								<td class="name">
									<xsl:value-of select="@Name"/>
								</td>
								<td>
									<xsl:value-of select="@Size"/>
								</td>
								
								<td>
									<xsl:choose>
										<xsl:when test="@Sex = 0">Женское</xsl:when>
										<xsl:when test="@Sex = 1">Мужское</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Season = 0">Лето</xsl:when>
										<xsl:when test="@Season = 1">Демисезон</xsl:when>
										<xsl:when test="@Season = 2">Зима</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Style = 0">Неважно</xsl:when>
										<xsl:when test="@Style = 1">Деловой</xsl:when>
										<xsl:when test="@Style = 2">Спортивный</xsl:when>
										<xsl:when test="@Style = 3">Домашний</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Color = 0">Неважно</xsl:when>
										<xsl:when test="@Color = 1">Темный</xsl:when>
										<xsl:when test="@Color = 2">Светлый</xsl:when>
										<xsl:when test="@Color = 3">Неяркий</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Age = 1">Ребенок</xsl:when>
										<xsl:when test="@Age = 2">Средний</xsl:when>
										<xsl:when test="@Age = 3">Пенсионер</xsl:when>
										<xsl:when test="@Age = 0">Неважно</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:value-of select="@Details"/>
								</td>
							</tr>
						</xsl:for-each>
					</table>

<div class="fieldheader">
					<xsl:variable name="numberid" select="//Order[1]/MainInfo/@Number"/>
					Заказ №<xsl:value-of select="//Order[1]/Numbers/NumbersRow[@RowID=$numberid]/@Number"/>
				</div>
				<div class="digest">
					<xsl:value-of select="//Order[1]/MainInfo/@Digest"/>
				</div>
				<table width="100%" border="1">
						<th>№</th>
						<th>Назание</th>
						<th>Размер</th>						
						<th>Пол</th>
						<th>Сезон</th>
						<th>Стиль</th>
						<th>Цвет</th>
						<th>Возраст</th>
						<th>Комментарий</th>
						<xsl:for-each select="//Order[1]/OrderItems/OrderItemsRow">
							<tr>
								<td>
									<xsl:value-of select="@Number"/>
								</td>
								<td class="name">
									<xsl:value-of select="@Name"/>
								</td>
								<td>
									<xsl:value-of select="@Size"/>
								</td>
								
								<td>
									<xsl:choose>
										<xsl:when test="@Sex = 0">Женское</xsl:when>
										<xsl:when test="@Sex = 1">Мужское</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Season = 0">Лето</xsl:when>
										<xsl:when test="@Season = 1">Демисезон</xsl:when>
										<xsl:when test="@Season = 2">Зима</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Style = 0">Неважно</xsl:when>
										<xsl:when test="@Style = 1">Деловой</xsl:when>
										<xsl:when test="@Style = 2">Спортивный</xsl:when>
										<xsl:when test="@Style = 3">Домашний</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Color = 0">Неважно</xsl:when>
										<xsl:when test="@Color = 1">Темный</xsl:when>
										<xsl:when test="@Color = 2">Светлый</xsl:when>
										<xsl:when test="@Color = 3">Неяркий</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Age = 1">Ребенок</xsl:when>
										<xsl:when test="@Age = 2">Средний</xsl:when>
										<xsl:when test="@Age = 3">Пенсионер</xsl:when>
										<xsl:when test="@Age = 0">Неважно</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:value-of select="@Details"/>
								</td>
							</tr>
						</xsl:for-each>
					</table>

<div class="fieldheader">
					<xsl:variable name="numberid" select="//Order[1]/MainInfo/@Number"/>
					Заказ №<xsl:value-of select="//Order[1]/Numbers/NumbersRow[@RowID=$numberid]/@Number"/>
				</div>
				<div class="digest">
					<xsl:value-of select="//Order[1]/MainInfo/@Digest"/>
				</div>
				<table width="100%" border="1">
						<th>№</th>
						<th>Назание</th>
						<th>Размер</th>						
						<th>Пол</th>
						<th>Сезон</th>
						<th>Стиль</th>
						<th>Цвет</th>
						<th>Возраст</th>
						<th>Комментарий</th>
						<xsl:for-each select="//Order[1]/OrderItems/OrderItemsRow">
							<tr>
								<td>
									<xsl:value-of select="@Number"/>
								</td>
								<td class="name">
									<xsl:value-of select="@Name"/>
								</td>
								<td>
									<xsl:value-of select="@Size"/>
								</td>
								
								<td>
									<xsl:choose>
										<xsl:when test="@Sex = 0">Женское</xsl:when>
										<xsl:when test="@Sex = 1">Мужское</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Season = 0">Лето</xsl:when>
										<xsl:when test="@Season = 1">Демисезон</xsl:when>
										<xsl:when test="@Season = 2">Зима</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Style = 0">Неважно</xsl:when>
										<xsl:when test="@Style = 1">Деловой</xsl:when>
										<xsl:when test="@Style = 2">Спортивный</xsl:when>
										<xsl:when test="@Style = 3">Домашний</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Color = 0">Неважно</xsl:when>
										<xsl:when test="@Color = 1">Темный</xsl:when>
										<xsl:when test="@Color = 2">Светлый</xsl:when>
										<xsl:when test="@Color = 3">Неяркий</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:choose>
										<xsl:when test="@Age = 1">Ребенок</xsl:when>
										<xsl:when test="@Age = 2">Средний</xsl:when>
										<xsl:when test="@Age = 3">Пенсионер</xsl:when>
										<xsl:when test="@Age = 0">Неважно</xsl:when>
									</xsl:choose>
								</td>
								<td>
									<xsl:value-of select="@Details"/>
								</td>
							</tr>
						</xsl:for-each>
					</table>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
