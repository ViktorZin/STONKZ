using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace STONKZ.Server.Migrations.UserData
{
    /// <inheritdoc />
    public partial class UserDataAddition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserDatas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AccountBalance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GameDay = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TransactionFee = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDatas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OwnedStonkzs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StonkId = table.Column<int>(type: "int", nullable: false),
                    PricePerStonk = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BoughtDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OwnedStonkzs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OwnedStonkzs_UserDatas_StonkId",
                        column: x => x.StonkId,
                        principalTable: "UserDatas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OwnedStonkzs_StonkId",
                table: "OwnedStonkzs",
                column: "StonkId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OwnedStonkzs");

            migrationBuilder.DropTable(
                name: "UserDatas");
        }
    }
}
