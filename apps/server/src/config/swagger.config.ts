import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as YAML from 'yamljs';
import { join } from 'path';

export function setupSwagger(app) {
  const yamlDocumentPath = join(
    __dirname,
    '../../../',
    'docs/swagger-spec.yaml',
  );
  console.log('yamlDocumentPath', yamlDocumentPath);
  const document = YAML.load(yamlDocumentPath);

  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/yaml',
  });
}
