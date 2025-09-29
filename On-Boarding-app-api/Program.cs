using OnboardingApi.Models;
using OnboardingApi.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient<AlfrescoService>();
builder.Services.AddSingleton<MongoService>();
builder.Services.AddSingleton<AlfrescoService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options => options.AddPolicy("AngularClient", policy =>
{ policy.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader(); }));// this is to stop  blocked by CORS policy: No 'Access-Control-Allow-Origin'

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AngularClient");


// RESt api that handles saving into mongodb
app.MapPost("/onboarding", async (Client data,MongoService mongo ) =>
{
    try
    {

        await mongo.Save(data);// Save 

        return Results.Ok(new { message = "Client saved successfully" });
    }
    catch (Exception ex)
    {
        Console.WriteLine("ERROR: " + ex.Message);
        return Results.Problem("Internal Server Error: " + ex.Message);
    }
});

// alfresco api for file and metadata upload aswell as folder creation with respective information
app.MapPost("/onboarding/files", [Microsoft.AspNetCore.Authorization.AllowAnonymous]
async (HttpRequest request, AlfrescoService alfresco) => // switched here to http request because [fromform] causes anti forgery error
{

    
    // setting up cinfront and cinback in formfiles
    if (!request.HasFormContentType) 
        return Results.BadRequest("Expected multipart/form-data");
    var formFiles = await request.ReadFormAsync();

    //setting up metadata here to be added to the new folder in alfresco
    var metadata = request.Query["metadata"];
 if (string.IsNullOrEmpty(metadata))
        return Results.BadRequest("Metadata is required");

    // Decode and deserialize JSON
    var decodedJson = Uri.UnescapeDataString(metadata!);
    var formData = JsonSerializer.Deserialize<Client>(decodedJson);




    var cinFront = formFiles.Files.GetFile("CinFront");
    var cinBack = formFiles.Files.GetFile("CinBack");

    var cinFolderId = await alfresco.CreateFolder(formData);

    //  Upload files into CIN folder
    if (cinFront != null)
        await alfresco.UploadFile(cinFront, cinFolderId, "CIN_Front.jpg");

    if (cinBack != null)
        await alfresco.UploadFile(cinBack, cinFolderId, "CIN_Back.jpg");

    return Results.Ok(new { message = $"Files uploaded under folder {formData.CIN}" });
}).RequireCors(cors => cors.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()); //probably unecessary


app.Run();

