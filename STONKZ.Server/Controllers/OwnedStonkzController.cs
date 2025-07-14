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
            Console.WriteLine("SERVER GET OWNEDSTONKZ");
            UserDataContext context = new UserDataContext();

            var OwnedStonkz = context.OwnedStonkzs;
            if(OwnedStonkz.Any())
            {
                Console.WriteLine("SERVER FOUND OWNED STONKZ. RETURNING");
                return OwnedStonkz.ToArray();
            }
            else
            {
                return new List<OwnedStonkz>();
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] List<OwnedStonkz> OwdStonkz)
        {
            Console.WriteLine("OWNED STONKZ POST METHOD START");
            if(OwdStonkz == null)
            {
                return BadRequest("Request body is missing or invalid");
            }

            UserDataContext context = new UserDataContext();
            foreach(var stonk in OwdStonkz)
            {
                if(stonk == null)
                {
                    continue;
                }


                if(stonk.Id == 0 || !context.OwnedStonkzs.Any(s => s.Id == stonk.Id))
                {
                    context.OwnedStonkzs.Add(stonk);
                }
                else
                {
                    context.OwnedStonkzs.Update(stonk);
                }
            }

            context.SaveChanges();
            return Ok(OwdStonkz);
        }

        /*
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
        }*/

        [HttpDelete]
        public IActionResult Delete([FromBody] List<OwnedStonkz>OwdStonkz)
        {
            Console.WriteLine("Attempting to delete OwnedStonkz. Given List count: " + OwdStonkz.Count);
            using (var context = new UserDataContext())
            {
                for(int i = 0; i <  OwdStonkz.Count; i++)
                {
                    var data = context.OwnedStonkzs.Find(OwdStonkz[i].Id);
                    if (data == null)
                    {
                        return NotFound("OwnedStonkz not Found");

                    } else
                    {
                        context.OwnedStonkzs.Remove(data);             
                    }
                }
                context.SaveChanges();
            }
            return NoContent();
        }

    }
}
