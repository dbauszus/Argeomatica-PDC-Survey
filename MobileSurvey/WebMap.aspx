<%@ Page Language="vb" Culture="es-MX" UICulture="es" AutoEventWireup="false" CodeBehind="WebMap.aspx.vb" Inherits="MobileSurvey.WebMap" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">

    <head runat="server">
        <title>Argeomatica Mobile</title>
        <script type="text/javascript" src="//maps.google.com/maps/api/js?sensor=false"></script>
        <script type="text/javascript" src="scripts/openLayers.2.13.1.js"></script>
        <script type="text/javascript" src="scripts/jQuery.2.1.0.js"></script>
        <script type="text/javascript" src="scripts/jQueryUI.1.10.4.js"></script>
        <script type="text/javascript" src="scripts/WebMap.js"></script>
        <link rel="stylesheet" href="css/WebMap.css" />
        <link rel="stylesheet" href="fontawesome/css/font-awesome.min.css" />
        <meta name="viewport" content="width=500px" />
    </head>

    <body>

        <div id="mask"></div>

        <a id="zoomLocation" class="btnMap" href="#" onclick="zoomLocation(); return false"><i class="fa fa-compass fa-3x"></i></a>
        <a id="save" class="btnPnl" href="#" onclick="save(); return false;"><i id="saveIcon" class="fa fa-sort-down fa-3x"></i></a>

        <div id="map"></div>

        <form id="frmPanel" runat="server">

            <asp:ScriptManager ID="scriptManager" runat="server"></asp:ScriptManager>

            <asp:TextBox ID="tbSAS" CssClass="textbox" runat="server" style="display:none" />
            <asp:TextBox ID="tbNOW" CssClass="textbox" runat="server" style="display:none" />

        <asp:Panel ID="pnlPredio" runat="server">

            <asp:UpdatePanel ID="updatePanelPredio" runat="server">

                <ContentTemplate>

                    <div id="progressBar" style="width:100%; height:5px; background-color:#E8E8E8; position:fixed; top:50%; z-index:1001;"></div>
                    <div id="progressBarActual" style="width:0%; height:5px; background-color:#CC0066; position:fixed; top:50%; z-index:1001;"></div>

                    <div style="display: none">
                        <asp:Button ID="ASPsave" Text="ASPsave" runat="server" />
                    </div>

                    <table>

                        <tr><td>NIVELS</td></tr>
                        <tr><td>
                        <asp:DropDownList id="ddNivels" runat="server">
                            <asp:ListItem Value=""></asp:ListItem>
                            <asp:ListItem Value="1">1</asp:ListItem>
                            <asp:ListItem Value="2">2</asp:ListItem>
                            <asp:ListItem Value="3">3</asp:ListItem>
                            <asp:ListItem Value="4">4</asp:ListItem>
                            <asp:ListItem Value="5">5</asp:ListItem>
                            <asp:ListItem Value="6">6</asp:ListItem>
                            <asp:ListItem Value="7">7</asp:ListItem>
                            <asp:ListItem Value="8">8</asp:ListItem>
                            <asp:ListItem Value="9">9</asp:ListItem>
                        </asp:DropDownList>                          
                        </td></tr>

                        <tr><td>DEPARTMENTOS</td></tr>
                        <tr><td><asp:TextBox ID="tbDepartmentos" CssClass="textbox" runat="server" /></td></tr>

                        <tr><td>TIENDAS</td></tr>
                        <tr><td><asp:TextBox ID="tbTiendas" CssClass="textbox" runat="server" /></td></tr>

                        <tr><td>GASTRONOMIA</td></tr>
                        <tr><td><asp:TextBox ID="tbGastronomia" CssClass="textbox" runat="server" /></td></tr>

                        <tr><td>HOTEL (HABITACIONES)</td></tr>
                        <tr><td><asp:TextBox ID="tbHotel" CssClass="textbox" runat="server" /></td></tr>

                        <tr><td>INSTITUCIONAL</td></tr>
                        <tr><td><asp:TextBox ID="tbInstitucional" CssClass="textbox" runat="server" /></td></tr>

                        <tr><td>STATUS</td></tr>
                        <tr><td>
                        <asp:DropDownList id="ddStatus" runat="server">
                            <asp:ListItem Value=""></asp:ListItem>
                            <asp:ListItem Value="Verificado">Verificado</asp:ListItem>
                            <asp:ListItem Value="Union">Union</asp:ListItem>
                            <asp:ListItem Value="Baldio">Baldio</asp:ListItem>
                            <asp:ListItem Value="Abandonado">Abandonado</asp:ListItem>
                            <asp:ListItem Value="Construcion">Construcion</asp:ListItem>
                        </asp:DropDownList>
                        </td></tr>

                        <tr><td><asp:TextBox ID="tbUnion" CssClass="textbox" runat="server" enabled="false" style="display: none"/></td></tr>

                        <tr><td>NOTAS</td></tr>
                        <tr><td><asp:TextBox ID="tbNotas" CssClass="textbox" runat="server" /></td></tr>

                        <tr><td>ÚLTIMO CAMBIO</td></tr>
                        <tr><td><asp:TextBox ID="tbUltimoCambio" CssClass="textbox" runat="server" enabled="false" /></td></tr>

                        <tr><td>USUARIO</td></tr>
                        <tr><td><asp:TextBox ID="tbUsario" CssClass="textbox" runat="server" enabled="false" /></td></tr>

                        <tr><td>UID</td></tr>
                        <tr><td><asp:TextBox ID="tbUID" CssClass="textbox" runat="server" enabled="false" /></td></tr>

                    </table>

                    <div id="takeFoto"><a href="#" onclick="$('#imgFile').click(); return false"><i class="fa fa-camera"></i></a></div>
                    <input type="file" id="imgFile" accept="image/*" onchange="loadPicture(this.files[0])" style="display: none">
                    <div id="canvasHold"><canvas id="imgCanvas" width="0" height="0"></canvas></div>
                    <asp:TextBox ID="tbCloudFoto" CssClass="textbox" runat="server" enabled="false" style="display:none"/>

                </ContentTemplate>

            </asp:UpdatePanel>

        </asp:Panel>

    </form>

    </body>

</html>