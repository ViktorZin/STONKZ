using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace STONKZ.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Stonkz",
                columns: table => new
                {
                    StonkId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StonkName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stonkz", x => x.StonkId);
                });

            migrationBuilder.CreateTable(
                name: "StonkDataz",
                columns: table => new
                {
                    StonkDataId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Open = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    High = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Low = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Volume = table.Column<long>(type: "bigint", nullable: false),
                    ChangePercentage = table.Column<double>(type: "float", nullable: false),
                    StonkId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StonkDataz", x => x.StonkDataId);
                    table.ForeignKey(
                        name: "FK_StonkDataz_Stonkz_StonkId",
                        column: x => x.StonkId,
                        principalTable: "Stonkz",
                        principalColumn: "StonkId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_StonkDataz_StonkId",
                table: "StonkDataz",
                column: "StonkId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StonkDataz");

            migrationBuilder.DropTable(
                name: "Stonkz");
        }
    }
}
