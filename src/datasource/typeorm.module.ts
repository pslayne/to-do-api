import { DataSource } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import { configService } from '../config/config.service'

@Global() // makes the module available globally for other modules once imported in the app modules
@Module({
  imports: [],
  providers: [
    {
      provide: DataSource, // add the datasource as a provider
      inject: [],
      useFactory: async () => {
        // using the factory function to create the datasource instance
        try {
          const dataSource = new DataSource(configService.getTypeOrmConfig());
          await dataSource.initialize(); // initialize the data source
          console.log('Database connected successfully');
          return dataSource;
        } catch (error) {
          console.log('Error connecting to database');
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}