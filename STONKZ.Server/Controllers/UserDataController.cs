using Microsoft.AspNetCore.Mvc;
using STONKZ.Server.Data;
using STONKZ.Server.Models;


namespace STONKZ.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserDataController : ControllerBase
    {
        private readonly ILogger<UserDataController> _logger;

        public UserDataController(ILogger<UserDataController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetUserData")]
        public IEnumerable<UserData> Get()
        {
            UserDataContext context = new UserDataContext();

            var UserData = context.UserDatas;

            if (UserData.Any()) 
            {
                return UserData.ToArray();
            }
            else
            {
                return new List<UserData>();    
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] UserData user)
        {
            Console.WriteLine("POST WIRD GEHITTET");
            if (user == null)
            {
                return BadRequest("User Data is null");
            }

            using (var context = new UserDataContext())
            {
                context.UserDatas.Add(user);
                context.SaveChanges();
            }

            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }

        [HttpPut("{id}", Name = "UpdateUserData")]
        public IActionResult Put(int id, [FromBody] UserData updatedUser)
        {
            if (updatedUser == null || updatedUser.Id != id)
            {
                return BadRequest("User Data is Invalid");
            }

            using (var context = new UserDataContext())
            {
                var existingUser = context.UserDatas.Find(id);
                if (existingUser == null) 
                {
                    return NotFound("User not Found");
                }

                existingUser.AccountBalance = updatedUser.AccountBalance;
                existingUser.GameDay = updatedUser.GameDay;
                //existingUser.StonkzWallet = updatedUser.StonkzWallet;   

                context.SaveChanges();
            }
            return NoContent();
        }

        [HttpDelete("{id}", Name = "DeleteUserData")]
        public IActionResult Delete(int id)
        {
            using (var context = new UserDataContext())
            {
                var targetUser = context.UserDatas.Find(id);
                if (targetUser == null)
                {
                    return NotFound("User not Found");
                }

                context.UserDatas.Remove(targetUser);
                context.SaveChanges();
            }
            return NoContent();
        }
    }
}
