package com.ultex.crm.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(
                Object.class,
                Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries())
            )
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build()
        );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.ultex.crm.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.ultex.crm.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.ultex.crm.domain.User.class.getName());
            createCache(cm, com.ultex.crm.domain.Authority.class.getName());
            createCache(cm, com.ultex.crm.domain.User.class.getName() + ".authorities");
            createCache(cm, com.ultex.crm.domain.Client.class.getName());
            createCache(cm, com.ultex.crm.domain.Client.class.getName() + ".opportunities");
            createCache(cm, com.ultex.crm.domain.Client.class.getName() + ".cyclesActivations");
            createCache(cm, com.ultex.crm.domain.Client.class.getName() + ".contacts");
            createCache(cm, com.ultex.crm.domain.Prospect.class.getName());
            createCache(cm, com.ultex.crm.domain.Prospect.class.getName() + ".contacts");
            createCache(cm, com.ultex.crm.domain.Opportunity.class.getName());
            createCache(cm, com.ultex.crm.domain.InternalUser.class.getName());
            createCache(cm, com.ultex.crm.domain.InternalUser.class.getName() + ".opportunities");
            createCache(cm, com.ultex.crm.domain.InternalUser.class.getName() + ".convertedProspects");
            createCache(cm, com.ultex.crm.domain.Company.class.getName());
            createCache(cm, com.ultex.crm.domain.Company.class.getName() + ".clients");
            createCache(cm, com.ultex.crm.domain.Company.class.getName() + ".prospects");
            createCache(cm, com.ultex.crm.domain.Company.class.getName() + ".contacts");
            createCache(cm, com.ultex.crm.domain.Contact.class.getName());
            createCache(cm, com.ultex.crm.domain.SocieteLiee.class.getName());
            createCache(cm, com.ultex.crm.domain.ContactAssocie.class.getName());
            createCache(cm, com.ultex.crm.domain.DocumentClient.class.getName());
            createCache(cm, com.ultex.crm.domain.DemandeClient.class.getName());
            createCache(cm, com.ultex.crm.domain.DemandeClient.class.getName() + ".sousServices");
            createCache(cm, com.ultex.crm.domain.ProduitDemande.class.getName());
            createCache(cm, com.ultex.crm.domain.HistoriqueCRM.class.getName());
            createCache(cm, com.ultex.crm.domain.KycClient.class.getName());
            createCache(cm, com.ultex.crm.domain.History.class.getName());
            createCache(cm, com.ultex.crm.domain.Devise.class.getName());
            createCache(cm, com.ultex.crm.domain.Incoterm.class.getName());
            createCache(cm, com.ultex.crm.domain.Pays.class.getName());
            createCache(cm, com.ultex.crm.domain.SousService.class.getName());
            createCache(cm, com.ultex.crm.domain.SousService.class.getName() + ".demandes");
            createCache(cm, com.ultex.crm.domain.CycleActivation.class.getName());
            createCache(cm, com.ultex.crm.domain.CycleActivation.class.getName() + ".etats");
            createCache(cm, com.ultex.crm.domain.EtatInteraction.class.getName());
            createCache(cm, com.ultex.crm.domain.RappelAgent.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
