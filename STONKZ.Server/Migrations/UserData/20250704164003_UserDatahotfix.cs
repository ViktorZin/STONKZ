using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace STONKZ.Server.Migrations.UserData
{
    /// <inheritdoc />
    public partial class UserDatahotfix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OwnedStonkzs_UserDatas_StonkId",
                table: "OwnedStonkzs");

            migrationBuilder.DropIndex(
                name: "IX_OwnedStonkzs_StonkId",
                table: "OwnedStonkzs");

            migrationBuilder.AddColumn<int>(
                name: "UserDataId",
                table: "OwnedStonkzs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_OwnedStonkzs_UserDataId",
                table: "OwnedStonkzs",
                column: "UserDataId");

            migrationBuilder.AddForeignKey(
                name: "FK_OwnedStonkzs_UserDatas_UserDataId",
                table: "OwnedStonkzs",
                column: "UserDataId",
                principalTable: "UserDatas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OwnedStonkzs_UserDatas_UserDataId",
                table: "OwnedStonkzs");

            migrationBuilder.DropIndex(
                name: "IX_OwnedStonkzs_UserDataId",
                table: "OwnedStonkzs");

            migrationBuilder.DropColumn(
                name: "UserDataId",
                table: "OwnedStonkzs");

            migrationBuilder.CreateIndex(
                name: "IX_OwnedStonkzs_StonkId",
                table: "OwnedStonkzs",
                column: "StonkId");

            migrationBuilder.AddForeignKey(
                name: "FK_OwnedStonkzs_UserDatas_StonkId",
                table: "OwnedStonkzs",
                column: "StonkId",
                principalTable: "UserDatas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
