using Microsoft.AspNetCore.Mvc;
using STONKZ.Server.Data;
using STONKZ.Server.Models;

namespace STONKZ.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StonkDataController : ControllerBase
    {
        private readonly ILogger<StonkDataController> _logger;

        public StonkDataController(ILogger<StonkDataController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetAllStonkzData")]
        public IEnumerable<StonkData> Get()
        {
            StonkzContext context = new StonkzContext();

            //var StonkDataList = context.StonkData.Where(d => d.StonkId == 1);
            var StonkDataList = context.StonkData;

            if (StonkDataList.Any()) 
            {
                Console.WriteLine("I got a List of StonkData for Angular!");
                return StonkDataList.ToArray();
            }
            else
            {
                return new List<StonkData>();

            }   
        }

        [HttpGet("{id}", Name ="GetStonkDataById")]
        public IEnumerable<StonkData> Get(int id)
        {
            Console.WriteLine("I am trying to get some StonkData....");
            StonkzContext context = new StonkzContext();

            var StonkDataList = context.StonkData.Where(d => d.StonkId == id);

            if (StonkDataList.Any())
            {
                Console.WriteLine("I am getting StonkData BY ID " + id);
                return StonkDataList.ToArray();
            }
            else
            {
                return new List<StonkData>();

            }
        }

        [HttpGet("{id}/{toYear}/{toMonth}/{toDay}")]
        public IEnumerable<StonkData> Get(int id, int toYear, int toMonth, int toDay)
        {
            StonkzContext context = new StonkzContext();
            DateTime DateGate = new DateTime(toYear, toMonth, toDay);
            var StonkDataList = context.StonkData.Where(d => (d.StonkId == id) && (d.Date <= DateGate));

            if(StonkDataList.Any())
            {
                return StonkDataList.ToArray();
            }
            else
            {
                return new List<StonkData>();
            }
        }


    }
}
