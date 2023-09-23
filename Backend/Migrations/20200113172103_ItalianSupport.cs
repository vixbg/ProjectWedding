using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class ItalianSupport : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Italian",
                table: "Guests",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Italian",
                table: "Guests");
        }
    }
}
