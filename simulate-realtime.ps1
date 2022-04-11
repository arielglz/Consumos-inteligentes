
While(1){
    $DBConnectionString = "Driver={PostgreSQL UNICODE};Server=localhost;Port=5432;Database=micro_controller;Uid=postgres;Pwd=tengohambre1;"

    $DBConn = New-Object System.Data.Odbc.OdbcConnection
    $DBConn.ConnectionString = $DBConnectionString

    $DBCmd = $DBConn.CreateCommand()

    [void]$DBCmd.Parameters.Add("@Consumo", [System.Data.Odbc.OdbcType]::varchar, 30)
    [void]$DBCmd.Parameters.Add("@TimeStamp", [System.Data.Odbc.OdbcType]::varchar, 30)
    [void]$DBCmd.Parameters.Add("@Plug", [System.Data.Odbc.OdbcType]::integer)

    $DBCmd.CommandText = "INSERT INTO consumo (consumo, fecha, id_plug) VALUES(?,?,?)"

    $DBCmd.Connection.Open()

    $DBCmd.Parameters["@Consumo"].Value = '0.4352'
    $DBCmd.Parameters["@TimeStamp"].Value = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $DBCmd.Parameters["@Plug"].Value = '3'

    [void]$DBCmd.ExecuteNonQuery()

    $DBCmd.Parameters["@Consumo"].Value = '0.5452'
    $DBCmd.Parameters["@TimeStamp"].Value = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $DBCmd.Parameters["@Plug"].Value = '5'

    [void]$DBCmd.ExecuteNonQuery()
    Write-Output "Conectando a la BD"
}
