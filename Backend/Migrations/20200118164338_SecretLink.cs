using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class SecretLink : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SecretLink",
                table: "Guests",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SecretLink",
                table: "Guests");
        }
    }
}
