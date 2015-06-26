Imports System.Data
Imports System.Data.SqlClient
Imports System.Configuration
Imports System.Globalization
Imports Microsoft.WindowsAzure.Storage
Imports Microsoft.WindowsAzure.Storage.Auth
Imports Microsoft.WindowsAzure.Storage.Blob
Imports Microsoft.WindowsAzure.Storage.Shared.Protocol


Public Class WebMap

    Inherits System.Web.UI.Page

    Private storageAccount As CloudStorageAccount
    Private blobClient As CloudBlobClient
    Private serviceProperties As ServiceProperties
    Private blobContainer As CloudBlobContainer

    Private dt As DataTable
    Private conn As SqlConnection

    Protected Sub Page_Load() Handles Me.Load

        Trace.Write("Page_Load")

        storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings("StorageConnectionString").ConnectionString)
        blobClient = storageAccount.CreateCloudBlobClient
        blobContainer = blobClient.GetContainerReference("playadelcarmen")
        createSAS()

        'removeCorsRule()
        'setCorsRule()
        'addCorsRule()

        ddNivels.Attributes.Add("onchange", "tbChange(this);")
        ddStatus.Attributes.Add("onchange", "tbChange(this);")
        tbDepartmentos.Attributes.Add("onkeyup", "tbChange(this);")
        tbTiendas.Attributes.Add("onkeyup", "tbChange(this);")
        tbGastronomia.Attributes.Add("onkeyup", "tbChange(this);")
        tbHotel.Attributes.Add("onkeyup", "tbChange(this);")
        tbInstitucional.Attributes.Add("onkeyup", "tbChange(this);")
        tbUnion.Attributes.Add("onkeyup", "tbChange(this);")
        tbNotas.Attributes.Add("onkeyup", "tbChange(this);")

    End Sub

    Protected Sub save() Handles ASPsave.Click

        Try

            conn = New SqlConnection(ConfigurationManager.ConnectionStrings("SQLConnectionString").ConnectionString)
            conn.Open()
            Dim cmd = New SqlCommand
            cmd.Connection = conn
            cmd.CommandType = CommandType.Text
            cmd.CommandText = "UPDATE [GIS].[dbo].[PREDIOS] SET nivels = @NIVELS, departmentos = @DEPARTMENTOS, tiendas = @TIENDAS, gastronomia = @GASTRONOMIA, hotel = @HOTEL, institucional = @INSTITUCIONAL, status = @STATUS, notas = @NOTAS, ultimocambio = @ULTIMOCAMBIO, usuario = @USUARIO, cloudfoto = @CLOUDFOTO, unionwith = @UNION WHERE uid = @UID;"
            cmd.Parameters.AddWithValue("@NIVELS", ddNivels.Text)
            cmd.Parameters.AddWithValue("@DEPARTMENTOS", tbDepartmentos.Text)
            cmd.Parameters.AddWithValue("@TIENDAS", tbTiendas.Text)
            cmd.Parameters.AddWithValue("@GASTRONOMIA", tbGastronomia.Text)
            cmd.Parameters.AddWithValue("@HOTEL", tbHotel.Text)
            cmd.Parameters.AddWithValue("@INSTITUCIONAL", tbInstitucional.Text)
            cmd.Parameters.AddWithValue("@STATUS", ddStatus.Text)
            cmd.Parameters.AddWithValue("@NOTAS", tbNotas.Text)
            cmd.Parameters.AddWithValue("@ULTIMOCAMBIO", tbNOW.Text)
            cmd.Parameters.AddWithValue("@USUARIO", Page.User.Identity.Name)
            cmd.Parameters.AddWithValue("@CLOUDFOTO", tbCloudFoto.Text)
            cmd.Parameters.AddWithValue("@UNION", tbUnion.Text)
            cmd.Parameters.AddWithValue("@UID", tbUID.Text)

            If cmd.ExecuteNonQuery = 1 Then
                conn.Close()
                System.Web.UI.ScriptManager.RegisterClientScriptBlock(Page, Me.GetType(), "Script", "onSelect();", True)

            Else
                conn.Close()
                System.Web.UI.ScriptManager.RegisterClientScriptBlock(Page, Me.GetType(), "Script", "SQLsavedFail();", True)

            End If

        Catch ex As Exception
            conn.Close()
        End Try

    End Sub

    Protected Sub createSAS()

        Dim sas = blobContainer.GetSharedAccessSignature(New SharedAccessBlobPolicy() With { _
        .Permissions = SharedAccessBlobPermissions.Write, _
        .SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(360)})
        tbSAS.Text = String.Format(CultureInfo.InvariantCulture, "{0}{1}", blobContainer.Uri, sas)

    End Sub

    Protected Sub removeCorsRule()

        serviceProperties = blobClient.GetServiceProperties()

        Dim corsSettings = serviceProperties.Cors
        corsSettings.CorsRules.Clear()
        blobClient.SetServiceProperties(serviceProperties)

    End Sub

    Protected Sub setCorsRule()

        serviceProperties = blobClient.GetServiceProperties()

        Dim corsRule = New CorsRule() With { _
            .AllowedHeaders = New List(Of String)() From {"x-ms-*", "content-type", "accept"}, _
            .AllowedMethods = CorsHttpMethods.Put, _
            .AllowedOrigins = New List(Of String)() From {"http://localhost", "http://192.168.100.132", "http://argeomatica2012.cloudapp.net", "http://argeomatica.cloudapp.net"}, _
            .MaxAgeInSeconds = 60}

        Dim corsSettings = serviceProperties.Cors
        corsSettings.CorsRules.Add(corsRule)
        blobClient.SetServiceProperties(serviceProperties)

    End Sub

    Protected Sub addCorsRule()

        serviceProperties = blobClient.GetServiceProperties()

        Dim corsSettings = serviceProperties.Cors
        Dim corsRuleToBeUpdated = corsSettings.CorsRules.FirstOrDefault(Function(a) a.AllowedOrigins.Contains("http://localhost"))
        If corsRuleToBeUpdated IsNot Nothing Then
            corsRuleToBeUpdated.AllowedMethods = corsRuleToBeUpdated.AllowedMethods Or CorsHttpMethods.Post
            blobClient.SetServiceProperties(serviceProperties)
        End If

    End Sub

End Class