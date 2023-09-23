using Backend.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.ObjectPool;

namespace Backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<BackendDbContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));
            services.AddCors(options =>
            {
                options.AddPolicy("def", builder =>
                {
                    builder.AllowAnyHeader();
                    builder.AllowAnyMethod();
                    builder.AllowAnyOrigin();
                });
            });
            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            InitializeDatabase(app);

            if (env.IsDevelopment()) app.UseDeveloperExceptionPage();

            app.UseRouting();

            app.UseAuthorization();

            app.UseCors("def");

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });


        }

        /// <summary>
        ///     Initializes the database.
        /// </summary>
        /// <param name="app">The application.</param>
        private void InitializeDatabase(IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope();
            var context = serviceScope.ServiceProvider.GetRequiredService<BackendDbContext>();
            context.Database.Migrate();

            // TODO: Create default user here
            // TODO: Create data ? or use empty database ?
        }
    }
}