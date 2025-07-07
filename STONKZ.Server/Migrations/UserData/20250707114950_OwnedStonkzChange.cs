using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace STONKZ.Server.Migrations.UserData
{
    /// <inheritdoc />
    public partial class OwnedStonkzChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OwnedStonkzs_UserDatas_UserDataId",
                table: "OwnedStonkzs");

            migrationBuilder.DropIndex(
                name: "IX_OwnedStonkzs_UserDataId",
                table: "OwnedStonkzs");

            migrationBuilder.RenameColumn(
                name: "UserDataId",
                table: "OwnedStonkzs",
                newName: "userId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "userId",
                table: "OwnedStonkzs",
                newName: "UserDataId");

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
    }
}
