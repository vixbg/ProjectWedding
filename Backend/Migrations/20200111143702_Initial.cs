using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Backend.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Guests",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Names = table.Column<string>(nullable: true),
                    Type = table.Column<byte>(nullable: false),
                    Email = table.Column<string>(nullable: true),
                    ViewedOn = table.Column<DateTime>(nullable: true),
                    Attending1 = table.Column<bool>(nullable: false),
                    Attending2 = table.Column<bool>(nullable: false),
                    Attending3 = table.Column<bool>(nullable: false),
                    PlusOneId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Guests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Guests_Guests_PlusOneId",
                        column: x => x.PlusOneId,
                        principalTable: "Guests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Guests_PlusOneId",
                table: "Guests",
                column: "PlusOneId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Guests");
        }
    }
}
