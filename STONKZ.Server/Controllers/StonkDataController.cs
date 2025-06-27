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

        [HttpGet(Name = "GetStonkzData")]
        public IEnumerable<StonkData> Get()
        {
            StonkzContext context = new StonkzContext();

            var StonkDataList = context.StonkData.Where(d => d.StonkId == 1);

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
    }
}
