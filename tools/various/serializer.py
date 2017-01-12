from django.db import models

from tools.various.db import underscore_to_camelcase


# API variants
# Export.export_front()
# BlogPost.export_front_all()
# BlogPost.export_front(BlogPost.objects.all()) ?
# BlogPost.objects.all().export('front') ?

# Prefetch related and select related cases
# Translations export

class Serializer(models.Model):
    def export(self, fields):
        result = {}

        for field in fields:
            field_name = underscore_to_camelcase(field)

            try:
                value = getattr(self, field)
            except AttributeError:
                continue

            result[field_name] = value

        return result

    def export_front(self):
        return self.export(self.Export.front)

    class Meta:
        abstract = True
