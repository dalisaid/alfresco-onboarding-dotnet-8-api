
public class ClientFileRecord
{
    public string FileName { get; set; }
    public string FilePath { get; set; }        // Full path if needed
    public string? FileContentBase64 { get; set; } // File content
}