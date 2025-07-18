﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using STONKZ.Server.Data;

#nullable disable

namespace STONKZ.Server.Migrations.UserData
{
    [DbContext(typeof(UserDataContext))]
    [Migration("20250704153932_UserDataAddition")]
    partial class UserDataAddition
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("STONKZ.Server.Models.OwnedStonkz", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("BoughtDate")
                        .HasColumnType("datetime2");

                    b.Property<decimal>("PricePerStonk")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("StonkId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("StonkId");

                    b.ToTable("OwnedStonkzs");
                });

            modelBuilder.Entity("STONKZ.Server.Models.UserData", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<decimal>("AccountBalance")
                        .HasColumnType("decimal(18,2)");

                    b.Property<DateTime>("GameDay")
                        .HasColumnType("datetime2");

                    b.Property<decimal>("TransactionFee")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("UserDatas");
                });

            modelBuilder.Entity("STONKZ.Server.Models.OwnedStonkz", b =>
                {
                    b.HasOne("STONKZ.Server.Models.UserData", "UserData")
                        .WithMany("StonkzWallet")
                        .HasForeignKey("StonkId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserData");
                });

            modelBuilder.Entity("STONKZ.Server.Models.UserData", b =>
                {
                    b.Navigation("StonkzWallet");
                });
#pragma warning restore 612, 618
        }
    }
}
