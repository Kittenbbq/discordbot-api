package api.Config;


import kittenbbq.discordbot.BotConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {


    public SecurityConfig() {

    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/messages/**").permitAll()
                .antMatchers("/api/sendMessage").hasRole("USER").and().httpBasic();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        BotConfig config = new BotConfig();
        System.out.println("USERNAME: " + config.getApiUsername());
        System.out.println("PW: " + config.getApiPassword());
        auth
                .inMemoryAuthentication()
                .withUser(config.getApiUsername()).password(config.getApiPassword()).roles("USER");
    }
}