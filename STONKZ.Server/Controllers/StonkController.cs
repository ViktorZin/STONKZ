using Microsoft.AspNetCore.Mvc;
using STONKZ.Server.Data;
using STONKZ.Server.Models;

namespace STONKZ.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StonkController : ControllerBase
    {
        private readonly ILogger<StonkController> _logger;

        public StonkController(ILogger<StonkController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetStonkz")]
        public IEnumerable<Stonk> Get()
        {
            StonkzContext context = new StonkzContext();

            var StonkDataList = context.Stonkz;

            if (StonkDataList.Any()) 
            {
                Console.WriteLine("I got a List of Stonkz for Angular!");
                return StonkDataList.ToArray();
            }
            else
            {
                return new List<Stonk>();

            }

                
        }
    }
}
