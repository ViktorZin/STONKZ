using Microsoft.AspNetCore.Mvc;
using STONKZ.Server.Data;
using STONKZ.Server.Models;


namespace STONKZ.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OwnedStonkzController : ControllerBase
    {
        private readonly ILogger<OwnedStonkzController> _logger;

        public OwnedStonkzController(ILogger<OwnedStonkzController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetOwnedStonkz")]
        public IEnumerable<OwnedStonkz> Get()
        {
            UserDataContext context = new UserDataContext();

            var OwnedStonkz = context.OwnedStonkzs;
            if(OwnedStonkz.Any())
            {
                return OwnedStonkz.ToArray();
            }
            else
            {
                return new List<OwnedStonkz>();
            }
        }


        [HttpPost(Name = "CreateOwnedStonkz")]
        public IActionResult Post([FromBody] OwnedStonkz OwdStonkz) 
        {
            if(OwdStonkz == null)
            {
                return BadRequest("Owned Stonkz is null");
            }

            using (var context = new UserDataContext()) 
            {
                context.OwnedStonkzs.Add(OwdStonkz);
                context.SaveChanges();
            }

            return CreatedAtAction(nameof(Get), new {id = OwdStonkz.Id}, OwdStonkz);
        }

        [HttpDelete("{id}", Name = "DeleteOwnedStonkz")]
        public IActionResult Delete(int id)
        {
            using (var context = new UserDataContext()) 
            {
                var targetData = context.OwnedStonkzs.Find(id);
                if(targetData == null)
                {
                    return NotFound("OwnedStonkz Data not Found");
                }

                context.OwnedStonkzs.Remove(targetData);
                context.SaveChanges();
            }

            return NoContent();
        }

    }
}
