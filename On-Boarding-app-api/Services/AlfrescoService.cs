using System.Text.Json;
using OnboardingApi.Models;

namespace OnboardingApi.Services;

public class AlfrescoService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;




    public AlfrescoService(HttpClient http, IConfiguration config)
    {



        _config = config;
        _http = http;


        string Username = config["Alfresco:Username"] ?? throw new InvalidOperationException("Username not configured");
        string Password = config["Alfresco:Password"] ?? throw new InvalidOperationException("Password not configured");
        string BaseUrl = config["Alfresco:BaseUrl"] ?? throw new InvalidOperationException("BaseUrl not configured");

        _http.BaseAddress = new Uri(BaseUrl);



        //basic auth
        var byteArray = System.Text.Encoding.ASCII.GetBytes($"{Username}:{Password}");
        _http.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));


    }


    public async Task<string> CreateFolder(Client folderData) //creates folder inside of library with Cin
    {

        string parentNodeId = _config["Alfresco:FolderNodeId"] ?? throw new InvalidOperationException("FolderNodeId not configured");
        var payload = new
        {
            name = folderData.CIN,       // folder name in Alfresco
            nodeType = "cm:folder",
            properties = new Dictionary<string, object>
        {
            { "cm:title", $"{folderData.FirstName} {folderData.LastName}" },
            { "cm:description", $"Client {folderData.FirstName} {folderData.LastName}, Card Number: {folderData.BankCardNumber}" }
        }

        };

        var response = await _http.PostAsJsonAsync(
            $"alfresco/api/-default-/public/alfresco/versions/1/nodes/{parentNodeId}/children",
            payload);

        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("entry").GetProperty("id").GetString()!;// return id of folder created to use in uploadfile
    }


    // uploads files into respective folder using cin 
    public async Task UploadFile(IFormFile file, string folderNodeId, string targetName)
    {
        using var content = new MultipartFormDataContent();
        var stream = file.OpenReadStream();
        content.Add(new StreamContent(stream), "filedata", targetName);

        var response = await _http.PostAsync(
            $"alfresco/api/-default-/public/alfresco/versions/1/nodes/{folderNodeId}/children",
            content);

        response.EnsureSuccessStatusCode();
    }
    
    

    

}