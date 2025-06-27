using Microsoft.VisualBasic.FileIO;
using STONKZ.Server.Data;
using STONKZ.Server.Models;

namespace STONKZ.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            
            //ReadStonkDataFromDatabase();

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            //ReadStonkDataFromCSV();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();

         
        }

        public static void ReadStonkDataFromCSV()
        {
            Console.WriteLine("Trying to Write to DB");
            string path = "C:/Users/vikto/Desktop/STONKZ DATA/";

            DirectoryInfo StonkzDir = new DirectoryInfo(path);
            using StonkzContext context = new StonkzContext();

            context.Database.EnsureCreated();

            for (int i = 0; i < StonkzDir.GetFiles().Length; i++) 
            {
                //Console.WriteLine(StonkzDir.GetFiles()[i].Name + "  index: " + i);
                //string renamedFile = StonkzDir.GetFiles()[i].Name.Replace("Stock Price History.csv", "").Trim();
               // Console.WriteLine(renamedFile);

                //using FileStream fs = new FileStream(path + StonkzDir.GetFiles()[i].Name, FileMode.Open, FileAccess.Read);
                //using StreamReader reader = new StreamReader(fs);

                using (TextFieldParser parser = new TextFieldParser(path + StonkzDir.GetFiles()[i].Name))
                {
                    parser.TextFieldType = FieldType.Delimited;
                    parser.SetDelimiters(",");
                    parser.HasFieldsEnclosedInQuotes = true;

                    Stonk Stonk = new Stonk();
                    Stonk.StonkName = StonkzDir.GetFiles()[i].Name.Replace("Stock Price History.csv", "").Trim();

                    context.Stonkz.Add(Stonk);

                    int lineIndex = 0;

                    while (!parser.EndOfData)
                    {
                        string[] fields = parser.ReadFields();

                        if(fields.Length == 7)
                        {
                            string fullLineAgain = StonkzDir.GetFiles()[i].Name + " == ";
                           
                            if(lineIndex > 0)
                            {
                                StonkData d = new StonkData();
                                d.Stonk = Stonk;
                                d.StonkId = Stonk.StonkId;
                                string[] dateParts = fields[0].Split('/');
                                d.Date = new DateTime(int.Parse(dateParts[2]), int.Parse(dateParts[0]), int.Parse(dateParts[1]));
                                d.Price = decimal.Parse(fields[1].Replace("\"", "").Replace(",", "")) / 100m;
                                d.Open = decimal.Parse(fields[2].Replace("\"", "").Replace(",", "")) / 100m;
                                d.High = decimal.Parse(fields[3].Replace("\"", "").Replace(",", "")) / 100m;
                                d.Low = decimal.Parse(fields[4].Replace("\"", "").Replace(",", "")) / 100m;
                                float tempVolume;
                                if (fields[5] == "")
                                {
                                    d.Volume = 0;
                                    //Console.WriteLine(fields[5] + " is Empty?!?");
                                }
                                else if (fields[5].Contains("M"))
                                {
                                    tempVolume = float.Parse(fields[5].Replace("M", ""));
                                    //Console.WriteLine(tempVolume * 10000f);
                                    d.Volume = (long)Math.Round(tempVolume * 10000f);
                                    //Console.WriteLine(d.Volume);
                                    //Console.WriteLine(fields[5] + " contains M!" + long.Parse(fields[5].Replace("M", "")));

                                }
                                else if (fields[5].Contains("K"))
                                {
                                    tempVolume = float.Parse(fields[5].Replace("K", ""));
                                    //Console.WriteLine(tempVolume * 10f);
                                    d.Volume = (long)Math.Round(tempVolume * 10f);
                                    //Console.WriteLine(fields[5] + " contains K!" + long.Parse(fields[5].Replace("K", "")));
                                }
                                else
                                {
                                    //Console.WriteLine(fields[5] + " ?");
                                }


                                    d.ChangePercentage = double.Parse(fields[6].Replace("%", "").Replace("\"", "")) / 100d;
                                context.StonkData.Add(d);
                            }
                           
                            lineIndex++;
                            if(lineIndex % 100 == 0)
                            {
                                context.SaveChanges();
                                Console.WriteLine("Saved DB");
                            }
                            Array.Clear(fields, 0, fields.Length);
                        } 
                    }
   
                }

                /*

                Stonk Stonk = new Stonk();
                //Dropbox.StonkId = 0;
                Stonk.StonkName = renamedFile;
                //Dropbox.StonkHistory = new List<StonkData>();
                List<StonkData> dataList = new List<StonkData>();

                //context.Stonkz.Add(Stonk);

                int stonkID = 0;
                int lineIndex = 0;
                string line;
                string[] columns;
                string[] dateParts;

                while ((line = reader.ReadLine()) != null)
                {
                    if (lineIndex == 0)
                    {
                        //skip first Line, which is Table header
                        lineIndex++;
                        continue;
                    }

                    columns = line.Split(',');
                    StonkData d = new StonkData();
                    columns[0] = columns[0].Replace("\"", "");
                    //ADD DATETIME PARSING!!!
                    dateParts = columns[0].Split('/');
                    d.Date = new DateTime(int.Parse(dateParts[2]), int.Parse(dateParts[0]), int.Parse(dateParts[1]));
                    //d.StonkDataId = stonkID++;
                    //Console.WriteLine($"ID: {d.StonkDataId} Date: {d.Date.ToString()}");
                    d.Price = decimal.Parse(columns[1].Replace("\"", "")) / 100m;
                    d.Open = decimal.Parse(columns[2].Replace("\"", "")) / 100m;
                    d.High = decimal.Parse(columns[3].Replace("\"", "")) / 100m;
                    d.Low = decimal.Parse(columns[4].Replace("\"", "")) / 100m;
                    //columns[5] = columns[5].Replace("M", "").Replace("K", "");
                    //Console.WriteLine(Stonk.StonkName + " | Volume: " + columns[5]);
                    d.ChangePercentage = double.Parse(columns[6].Replace("%", "").Replace("\"", "")) / 100d;
                    //d.Stonk = Stonk;
                    //d.StonkId = Stonk.StonkId;

                    //context.StonkData.Add(d);

                    //Dropbox.StonkHistory.Add(d);
                    //dataList.Add(d);
                    lineIndex++;
                }

                */
            }

            context.SaveChanges();
            Console.WriteLine("FINAL Save DB");
            //Console.ReadLine();
            //return;

            //context.SaveChanges();

            //using FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read);
            //using StreamReader reader = new StreamReader(fs);

            //using StonkzContext context = new StonkzContext();

            //Stonk Dropbox = new Stonk();
            ////Dropbox.StonkId = 0;
            //Dropbox.StonkName = "Dropbox Stonkz";
            ////Dropbox.StonkHistory = new List<StonkData>();
            //List<StonkData> dataList = new List<StonkData>();

            //context.Stonkz.Add(Dropbox);

            //int stonkID = 0;
            //int lineIndex = 0;
            //string line;
            //string[] columns;
            //string[] dateParts;

            //while ((line = reader.ReadLine()) != null)
            //{
            //    if (lineIndex == 0)
            //    {
            //        //skip first Line, which is Table header
            //        lineIndex++;
            //        continue;
            //    }

            //    columns = line.Split(',');
            //    StonkData d = new StonkData();
            //    columns[0] = columns[0].Replace("\"", "");
            //    //ADD DATETIME PARSING!!!
            //    dateParts = columns[0].Split('/');
            //    d.Date = new DateTime(int.Parse(dateParts[2]), int.Parse(dateParts[0]), int.Parse(dateParts[1]));
            //    //d.StonkDataId = stonkID++;
            //    //Console.WriteLine($"ID: {d.StonkDataId} Date: {d.Date.ToString()}");
            //    d.Price = decimal.Parse(columns[1].Replace("\"", "")) / 100m;
            //    d.Open = decimal.Parse(columns[2].Replace("\"", "")) / 100m;
            //    d.High = decimal.Parse(columns[3].Replace("\"", "")) / 100m;
            //    d.Low = decimal.Parse(columns[4].Replace("\"", "")) / 100m;
            //    columns[5] = columns[5].Replace("M", "").Replace("K", "");

            //    d.ChangePercentage = double.Parse(columns[6].Replace("%", "").Replace("\"", "")) / 100d;
            //    d.Stonk = Dropbox;
            //    d.StonkId = Dropbox.StonkId;

            //    context.StonkData.Add(d);

            //    //Dropbox.StonkHistory.Add(d);
            //    dataList.Add(d);
            //    lineIndex++;
            //}

            //context.SaveChanges();

            /*
            List<StonkData> myData = dataList;
            for(int i = 0; i < myData.Count; i++)
            {
                Console.WriteLine(myData[i].Price);
            }*/

            // using StonkzContext context = new StonkzContext();

            //context.Add(Dropbox);
            //context.SaveChanges();
            /* foreach(StonkData d in Dropbox.StonkHistory)
             {
                 context.Add(d);
             }*/


            //context.AddRange(dataList);
            // context.SaveChanges();

            //Stonk dbx = context.Stonkz.FirstOrDefault();
            /*
                        if(dbx == null)
                        {
                            Console.WriteLine("DBX is NULL");
                        }
                        else
                        {
                            Console.WriteLine("dbx found. dbx is " + dbx.StonkName);

                        }
            */
        }

        public static void ReadStonkDataFromDatabase()
        {
            using StonkzContext context = new StonkzContext();

            List<Stonk> Stonkz = context.Stonkz.ToList();

            foreach(Stonk s in Stonkz)
            {
                s.StonkHistory = context.StonkData.Where(d => d.StonkId == s.StonkId).ToList();
            }


            Console.WriteLine($"Stonk: {Stonkz[0].StonkName}, Latest Entry: " +
                $"{Stonkz[0].StonkHistory.ElementAt(0).Date.ToString()}, Price: " +
                $"{Stonkz[0].StonkHistory.ElementAt(0).Price.ToString()} ");
        }
    }
}
